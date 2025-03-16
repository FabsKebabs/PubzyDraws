
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function HelpCenter() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-orbitron text-white mb-8">Help Center</h1>
        
        <div className="grid gap-6">
          <Card className="bg-black/80 border-primary/20">
            <CardContent className="p-6">
              <h2 className="text-2xl font-orbitron text-white mb-4">Frequently Asked Questions</h2>
              
              <div className="space-y-6 font-rajdhani">
                <div>
                  <h3 className="text-xl text-cyan-400 mb-2">How do I enter giveaways?</h3>
                  <p className="text-gray-300">To enter giveaways, simply create an account and click the "Enter" button on any active giveaway. Make sure to follow all entry requirements.</p>
                </div>

                <div>
                  <h3 className="text-xl text-cyan-400 mb-2">How are winners selected?</h3>
                  <p className="text-gray-300">Winners are selected randomly from all valid entries. We use a secure random selection process to ensure fairness.</p>
                </div>

                <div>
                  <h3 className="text-xl text-cyan-400 mb-2">How will I know if I won?</h3>
                  <p className="text-gray-300">Winners will be notified via email and Discord. Make sure to keep your contact information up to date.</p>
                </div>

                <div>
                  <h3 className="text-xl text-cyan-400 mb-2">How do I claim my prize?</h3>
                  <p className="text-gray-300">Prize claiming instructions will be sent to winners directly. Most prizes are distributed within 24-48 hours of winner verification.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/80 border-primary/20">
            <CardContent className="p-6">
              <h2 className="text-2xl font-orbitron text-white mb-4">Contact Support</h2>
              <p className="text-gray-300 font-rajdhani">Need more help? Join our Discord server for direct support from our team.</p>
              <a href="https://discord.gg/5FWvvEXQh8" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-rajdhani py-2 px-4 rounded transition-colors">
                Join Discord Server
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
