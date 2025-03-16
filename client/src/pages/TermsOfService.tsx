
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-orbitron text-white mb-8">Terms of Service</h1>
        
        <Card className="bg-black/80 border-primary/20">
          <CardContent className="p-6">
            <div className="space-y-6 font-rajdhani text-gray-300">
              <section>
                <h2 className="text-2xl font-orbitron text-white mb-4">1. Agreement to Terms</h2>
                <p>By accessing and using PubzyDraws, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
              </section>

              <section>
                <h2 className="text-2xl font-orbitron text-white mb-4">2. Giveaway Rules</h2>
                <p>All giveaways are subject to specific rules and requirements. Entry implies acceptance of these rules. Multiple accounts or automated entries are prohibited and will result in disqualification.</p>
              </section>

              <section>
                <h2 className="text-2xl font-orbitron text-white mb-4">3. Eligibility</h2>
                <p>Users must be of legal age in their jurisdiction to participate. Some giveaways may have additional eligibility requirements.</p>
              </section>

              <section>
                <h2 className="text-2xl font-orbitron text-white mb-4">4. Prize Claims</h2>
                <p>Winners must claim prizes within the specified timeframe. Unclaimed prizes may be forfeit or redrawn at our discretion.</p>
              </section>

              <section>
                <h2 className="text-2xl font-orbitron text-white mb-4">5. Account Security</h2>
                <p>Users are responsible for maintaining the security of their accounts and passwords. Any suspicious activity should be reported immediately.</p>
              </section>

              <section>
                <h2 className="text-2xl font-orbitron text-white mb-4">6. Modifications</h2>
                <p>We reserve the right to modify these terms at any time. Continued use of the service implies acceptance of any changes.</p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
