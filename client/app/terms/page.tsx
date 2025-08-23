import Link from "next/link"

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">
        Terms of Service
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-8">Last Updated: June 4, 2023</p>
          
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li><a href="#acceptance" className="text-brand-purple hover:text-brand-pink transition-colors">Acceptance of Terms</a></li>
              <li><a href="#eligibility" className="text-brand-purple hover:text-brand-pink transition-colors">Eligibility</a></li>
              <li><a href="#accounts" className="text-brand-purple hover:text-brand-pink transition-colors">User Accounts</a></li>
              <li><a href="#quests" className="text-brand-purple hover:text-brand-pink transition-colors">Quests and Submissions</a></li>
              <li><a href="#payments" className="text-brand-purple hover:text-brand-pink transition-colors">Payments and Rewards</a></li>
              <li><a href="#content" className="text-brand-purple hover:text-brand-pink transition-colors">Content Guidelines</a></li>
              <li><a href="#ip" className="text-brand-purple hover:text-brand-pink transition-colors">Intellectual Property</a></li>
              <li><a href="#termination" className="text-brand-purple hover:text-brand-pink transition-colors">Termination</a></li>
              <li><a href="#liability" className="text-brand-purple hover:text-brand-pink transition-colors">Limitation of Liability</a></li>
              <li><a href="#disputes" className="text-brand-purple hover:text-brand-pink transition-colors">Dispute Resolution</a></li>
              <li><a href="#changes" className="text-brand-purple hover:text-brand-pink transition-colors">Changes to Terms</a></li>
              <li><a href="#contact" className="text-brand-purple hover:text-brand-pink transition-colors">Contact Information</a></li>
            </ol>
          </div>
          
          <section id="acceptance" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              Welcome to QuestPanda. By accessing or using our platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
            <p>
              These Terms of Service apply to all users of the platform, including brands creating quests and content creators participating in quests.
            </p>
          </section>
          
          <section id="eligibility" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
            <p className="mb-4">
              You must be at least 18 years old to use QuestPanda. By using our platform, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into these Terms.
            </p>
            <p>
              Certain quests may have additional eligibility requirements, such as geographic restrictions or minimum follower counts, which will be specified in the quest details.
            </p>
          </section>
          
          <section id="accounts" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="mb-4">
              To access certain features of QuestPanda, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            <p className="mb-4">
              You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <p>
              QuestPanda reserves the right to suspend or terminate your account if any information provided proves to be inaccurate, not current, or incomplete.
            </p>
          </section>
          
          <section id="quests" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Quests and Submissions</h2>
            <p className="mb-4">
              <strong>For Brands:</strong> When creating a quest, you agree to provide clear guidelines, reasonable deadlines, and fair compensation. You must have the legal right to request the content specified in your quest.
            </p>
            <p className="mb-4">
              <strong>For Creators:</strong> When participating in a quest, you agree to follow the quest guidelines, meet deadlines, and create original content that complies with our Content Guidelines.
            </p>
            <p className="mb-4">
              QuestPanda reserves the right to remove any quest or submission that violates these Terms or our Content Guidelines.
            </p>
            <p>
              By submitting content to a quest, creators grant the brand a license to use the content as specified in the quest details. The specific terms of this license will be outlined in each quest.
            </p>
          </section>
          
          <section id="payments" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Payments and Rewards</h2>
            <p className="mb-4">
              <strong>For Brands:</strong> You agree to deposit the full prize pool amount when creating a quest. These funds will be held in escrow until the quest is completed and rewards are distributed.
            </p>
            <p className="mb-4">
              <strong>For Creators:</strong> Rewards will be distributed as specified in the quest details, typically after your submission has been approved by the brand.
            </p>
            <p className="mb-4">
              QuestPanda charges a platform fee for facilitating quests. These fees are clearly displayed during the quest creation process.
            </p>
            <p>
              All payments are subject to verification and may be delayed or withheld if there are concerns about fraud or violations of these Terms.
            </p>
          </section>
          
          <section id="content" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Content Guidelines</h2>
            <p className="mb-4">
              All content created or shared on QuestPanda must comply with our Content Guidelines, which prohibit:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Illegal or harmful content</li>
              <li>Hate speech or discrimination</li>
              <li>Harassment or bullying</li>
              <li>Sexually explicit material</li>
              <li>Violence or graphic content</li>
              <li>Misinformation or deceptive practices</li>
              <li>Content that infringes on intellectual property rights</li>
            </ul>
            <p>
              QuestPanda reserves the right to remove any content that violates these guidelines and to suspend or terminate accounts that repeatedly violate them.
            </p>
          </section>
          
          <section id="ip" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
            <p className="mb-4">
              QuestPanda respects intellectual property rights and expects all users to do the same.
            </p>
            <p className="mb-4">
              <strong>For Creators:</strong> You retain ownership of the content you create, but grant licenses as specified in the quest details.
            </p>
            <p className="mb-4">
              <strong>For Brands:</strong> You must have the legal right to use any materials provided in your quest briefs, including logos, product images, and brand guidelines.
            </p>
            <p>
              If you believe your intellectual property has been infringed upon, please contact us at legal@questpanda.com.
            </p>
          </section>
          
          <section id="termination" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
            <p className="mb-4">
              QuestPanda reserves the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, QuestPanda, or third parties, or for any other reason.
            </p>
            <p>
              Upon termination, your right to use QuestPanda will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </section>
          
          <section id="liability" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, QuestPanda shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Your use or inability to use QuestPanda</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
              <li>Any interruption or cessation of transmission to or from QuestPanda</li>
              <li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through QuestPanda</li>
              <li>Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through QuestPanda</li>
            </ul>
          </section>
          
          <section id="disputes" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Dispute Resolution</h2>
            <p className="mb-4">
              Any disputes arising out of or relating to these Terms or your use of QuestPanda shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
            </p>
            <p className="mb-4">
              The arbitration shall be conducted in English and shall take place in Nairobi, Kenya, or another location mutually agreed upon by the parties.
            </p>
            <p>
              Any judgment on the award rendered by the arbitrator may be entered in any court of competent jurisdiction.
            </p>
          </section>
          
          <section id="changes" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p className="mb-4">
              QuestPanda reserves the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
            </p>
            <p>
              By continuing to access or use QuestPanda after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use QuestPanda.
            </p>
          </section>
          
          <section id="contact" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mb-4">
              QuestPanda<br />
              Email: legal@questpanda.com<br />
              Address: 123 Creator Avenue, Nairobi, Kenya
            </p>
          </section>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <Link href="/" className="text-brand-purple hover:text-brand-pink transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  )
}
