import { google } from 'googleapis';

const SPREADSHEET_ID = '1TKd6JTNNrSxCkOXaXtectVZSvgNiHV_-t1f7GM2zQAw';

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Sheet names
const SHEETS = {
  USERS: 'Users',
  ENTRIES: 'Entries',
  GIVEAWAYS: 'Giveaways',
  GIVEAWAY_ENTRIES: 'GiveawayEntries',
  UPDATES: 'Updates',
  VIDEOS: 'Videos',
  LEADERBOARD: 'Leaderboard',
};

// Initialize sheets if they don't exist
export async function initializeSheets() {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const existingSheets = response.data.sheets?.map(
      (sheet) => sheet.properties?.title
    );

    // Create missing sheets
    for (const sheetName of Object.values(SHEETS)) {
      if (!existingSheets?.includes(sheetName)) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheetName,
                  },
                },
              },
            ],
          },
        });

        // Add headers based on sheet name
        const headers = getHeadersForSheet(sheetName);
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A1:Z1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [headers],
          },
        });
      }
    }
  } catch (error) {
    console.error('Error initializing sheets:', error);
    throw error;
  }
}

function getHeadersForSheet(sheetName: string): string[] {
  switch (sheetName) {
    case SHEETS.USERS:
      return ['id', 'username', 'email', 'password', 'avatarUrl', 'isAdmin', 'createdAt'];
    case SHEETS.ENTRIES:
      return ['id', 'email', 'name', 'enteredAt'];
    case SHEETS.GIVEAWAYS:
      return [
        'id',
        'title',
        'description',
        'prize',
        'imageUrl',
        'maxEntries',
        'endDate',
        'createdAt',
        'isActive',
      ];
    case SHEETS.GIVEAWAY_ENTRIES:
      return ['id', 'giveawayId', 'userId', 'createdAt'];
    case SHEETS.UPDATES:
      return ['id', 'title', 'content', 'type', 'iconName', 'createdAt'];
    case SHEETS.VIDEOS:
      return [
        'id',
        'videoId',
        'title',
        'description',
        'thumbnailUrl',
        'publishedAt',
        'viewCount',
        'fetchedAt',
      ];
    case SHEETS.LEADERBOARD:
      return ['id', 'username', 'Giveaway', 'prize', 'Date'];
    default:
      return [];
  }
}

// Simple in-memory cache
const cache: Record<string, {data: any, timestamp: number}> = {};
const CACHE_TTL = 60000; // 1 minute cache

// Helper functions for CRUD operations
export async function findOne(sheetName: string, query: Record<string, any>) {
  const cacheKey = `${sheetName}-${JSON.stringify(query)}`;
  const now = Date.now();
  
  // Check cache
  if (cache[cacheKey] && (now - cache[cacheKey].timestamp) < CACHE_TTL) {
    return cache[cacheKey].data;
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: sheetName,
  });

  const rows = response.data.values || [];
  const headers = rows[0];
  const data = rows.slice(1).map((row) =>
    headers.reduce((obj: any, header: string, index: number) => {
      obj[header] = row[index];
      return obj;
    }, {})
  );

  const result = data.find((row: any) =>
    Object.entries(query).every(([key, value]) => row[key] === value)
  );
  
  // Store in cache
  cache[cacheKey] = {
    data: result,
    timestamp: now
  };
  
  return result;
}

export async function findAll(sheetName: string, query?: Record<string, any>) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: sheetName,
  });

  const rows = response.data.values || [];
  const headers = rows[0];
  const data = rows.slice(1).map((row) =>
    headers.reduce((obj: any, header: string, index: number) => {
      obj[header] = row[index];
      return obj;
    }, {})
  );

  if (!query) return data;

  return data.filter((row: any) =>
    Object.entries(query).every(([key, value]) => row[key] === value)
  );
}

export async function insertOne(sheetName: string, data: Record<string, any>) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A1:1`,
  });

  const headers = response.data.values?.[0] || [];
  const newRow = headers.map((header) => data[header] || '');

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: sheetName,
    valueInputOption: 'RAW',
    requestBody: {
      values: [newRow],
    },
  });

  return data;
}

export async function updateOne(
  sheetName: string,
  query: Record<string, any>,
  data: Record<string, any>
) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: sheetName,
  });

  const rows = response.data.values || [];
  const headers = rows[0];
  const rowIndex = rows.findIndex((row, index) => {
    if (index === 0) return false; // Skip header row
    const rowData = headers.reduce((obj: any, header: string, i: number) => {
      obj[header] = row[i];
      return obj;
    }, {});
    return Object.entries(query).every(([key, value]) => rowData[key] === value);
  });

  if (rowIndex === -1) return null;

  const updatedRow = headers.map((header) => data[header] || rows[rowIndex][headers.indexOf(header)]);

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A${rowIndex + 1}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [updatedRow],
    },
  });

  return { ...data };
}

export const sheetsDb = {
  SHEETS,
  findOne,
  findAll,
  insertOne,
  updateOne,
  initializeSheets,
};