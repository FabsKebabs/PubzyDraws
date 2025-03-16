
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-orbitron text-white mb-8">Privacy Policy</h1>
        
        <Card className="bg-black/80 border-primary/20">
          <CardContent className="p-6">
            <div className="space-y-6 font-rajdhani text-gray-300">
              <section>
                <h2 className="text-2xl font-orbitron text-white mb-4">1. Information We Collect</h2>
                <p>We collect information you provide directly to us, including name, email address, and username when you register for an account or enter giveaways.</p>
              </section>

              <section>
                <h2 className="text-2xl font-orbitron text-white mb-4">2. How We Use Your Information</h2>
                <p>We use the information we collect to operate and maintain the website, process giveaway entries, and communicate with you about winners and prizes.</p>
              </section>

              <section>
                <h2 className="text-2xl font-orbitron text-white mb-4">3. Information Sharing</h2>
                <p>We do not sell or share your personal information with third parties except as necessary to operate our services or as required by law.</p>
              </section>

              <section>
                <h2 className="text-2xl font-orbitron text-white mb-4">4. Data Security</h2>
                <p>We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.</p>
              </section>

              <section>
                <h2 className="text-2xl font-orbitron text-white mb-4">5. Your Rights</h2>
                <p>You have the right to access, correct, or delete your personal information. Contact us through Discord for any privacy-related requests.</p>
              </section>

              <section>
                <h2 className="text-2xl font-orbitron text-white mb-4">6. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us through our Discord server.</p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
