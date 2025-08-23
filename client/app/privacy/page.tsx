import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">
        Privacy Policy
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-8">Last Updated: June 4, 2023</p>
          
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li><a href="#introduction" className="text-brand-purple hover:text-brand-pink transition-colors">Introduction</a></li>
              <li><a href="#collection" className="text-brand-purple hover:text-brand-pink transition-colors">Information We Collect</a></li>
              <li><a href="#usage" className="text-brand-purple hover:text-brand-pink transition-colors">How We Use Your Information</a></li>
              <li><a href="#sharing" className="text-brand-purple hover:text-brand-pink transition-colors">Information Sharing and Disclosure</a></li>
              <li><a href="#security" className="text-brand-purple hover:text-brand-pink transition-colors">Data Security</a></li>
              <li><a href="#rights" className="text-brand-purple hover:text-brand-pink transition-colors">Your Rights and Choices</a></li>
              <li><a href="#cookies" className="text-brand-purple hover:text-brand-pink transition-colors">Cookies and Tracking Technologies</a></li>
              <li><a href="#thirdparty" className="text-brand-purple hover:text-brand-pink transition-colors">Third-Party Services</a></li>
              <li><a href="#children" className="text-brand-purple hover:text-brand-pink transition-colors">Children's Privacy</a></li>
              <li><a href="#international" className="text-brand-purple hover:text-brand-pink transition-colors">International Data Transfers</a></li>
              <li><a href="#changes" className="text-brand-purple hover:text-brand-pink transition-colors">Changes to This Privacy Policy</a></li>
              <li><a href="#contact" className="text-brand-purple hover:text-brand-pink transition-colors">Contact Us</a></li>
            </ol>
          </div>
          
          <section id="introduction" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              QuestPanda ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access QuestPanda.
            </p>
          </section>
          
          <section id="collection" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="mb-4">
              We collect several types of information from and about users of our platform, including:
            </p>
            
            <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
            <p className="mb-4">
              When you register for an account, we collect:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number (optional)</li>
              <li>Profile picture (optional)</li>
              <li>Social media handles and metrics (for creators)</li>
              <li>Company information (for brands)</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">Usage Information</h3>
            <p className="mb-4">
              We automatically collect certain information about your device and how you interact with QuestPanda, including:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>IP address</li>
              <li>Device type and operating system</li>
              <li>Browser type</li>
              <li>Pages visited and features used</li>
              <li>Time spent on pages</li>
              <li>Referring website or application</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">Content Information</h3>
            <p className="mb-4">
              We collect information related to the content you create, share, or interact with on QuestPanda, including:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Quest submissions</li>
              <li>Comments and feedback</li>
              <li>Social media metrics related to your submissions</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">Payment Information</h3>
            <p>
              When you make or receive payments through QuestPanda, we collect payment information, which may include bank account details, cryptocurrency wallet addresses, or mobile money information. We do not store complete payment details on our servers; this information is processed by our payment service providers.
            </p>
          </section>
          
          <section id="usage" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Providing and maintaining QuestPanda</li>
              <li>Processing transactions and managing payments</li>
              <li>Matching creators with appropriate quests</li>
              <li>Analyzing quest performance and providing analytics to brands</li>
              <li>Communicating with you about quests, updates, and platform features</li>
              <li>Personalizing your experience on QuestPanda</li>
              <li>Improving our platform and developing new features</li>
              <li>Enforcing our Terms of Service and protecting against misuse</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>
          
          <section id="sharing" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
            <p className="mb-4">
              We may share your information in the following circumstances:
            </p>
            
            <h3 className="text-xl font-semibold mb-2">With Other Users</h3>
            <p className="mb-4">
              When you participate in quests, certain information (such as your profile, social media metrics, and submissions) will be visible to the brands that created those quests.
            </p>
            
            <h3 className="text-xl font-semibold mb-2">With Service Providers</h3>
            <p className="mb-4">
              We may share your information with third-party vendors, service providers, and other business partners who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting, and customer service.
            </p>
            
            <h3 className="text-xl font-semibold mb-2">For Legal Reasons</h3>
            <p className="mb-4">
              We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
            </p>
            
            <h3 className="text-xl font-semibold mb-2">Business Transfers</h3>
            <p className="mb-4">
              If QuestPanda is involved in a merger, acquisition, or sale of all or a portion of its assets, your information may be transferred as part of that transaction.
            </p>
            
            <h3 className="text-xl font-semibold mb-2">With Your Consent</h3>
            <p>
              We may share your information with third parties when we have your consent to do so.
            </p>
          </section>
          
          <section id="security" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.
            </p>
            <p className="mb-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for restricting access to your device.
            </p>
          </section>
          
          <section id="rights" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
            <p className="mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Access: You can request a copy of the personal information we hold about you.</li>
              <li>Correction: You can request that we correct inaccurate or incomplete information.</li>
              <li>Deletion: You can request that we delete your personal information in certain circumstances.</li>
              <li>Restriction: You can request that we restrict the processing of your information in certain circumstances.</li>
              <li>Data Portability: You can request a copy of your information in a structured, commonly used, and machine-readable format.</li>
              <li>Objection: You can object to our processing of your information in certain circumstances.</li>
            </ul>
            <p className="mb-4">
              To exercise these rights, please contact us at privacy@questpanda.com.
            </p>
            <p>
              Please note that we may need to verify your identity before responding to your request, and that some requests may be subject to limitations or exceptions under applicable law.
            </p>
          </section>
          
          <section id="cookies" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="mb-4">
              QuestPanda uses cookies and similar tracking technologies to track activity on our platform and hold certain information.
            </p>
            <p className="mb-4">
              Cookies are files with a small amount of data that may include an anonymous unique identifier. They are sent to your browser from a website and stored on your device.
            </p>
            <p className="mb-4">
              We use the following types of cookies:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Essential cookies: Necessary for the platform to function properly</li>
              <li>Analytical cookies: Help us understand how users interact with our platform</li>
              <li>Functional cookies: Remember your preferences and settings</li>
              <li>Targeting cookies: Track your browsing habits to deliver targeted advertising</li>
            </ul>
            <p className="mb-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of QuestPanda.
            </p>
          </section>
          
          <section id="thirdparty" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Third-Party Services</h2>
            <p className="mb-4">
              QuestPanda may contain links to third-party websites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
            </p>
            <p>
              We encourage you to review the privacy policies of any third-party websites or services that you visit from QuestPanda.
            </p>
          </section>
          
          <section id="children" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p className="mb-4">
              QuestPanda is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we learn that we have collected personal information from a child under 18, we will take steps to delete that information as quickly as possible.
            </p>
            <p>
              If you believe that we might have any information from or about a child under 18, please contact us at privacy@questpanda.com.
            </p>
          </section>
          
          <section id="international" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
            <p className="mb-4">
              Your information may be transferred to, and maintained on, computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction.
            </p>
            <p className="mb-4">
              If you are located outside Kenya and choose to provide information to us, please note that we transfer the information, including personal information, to Kenya and process it there.
            </p>
            <p>
              Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.
            </p>
          </section>
          
          <section id="changes" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            <p className="mb-4">
              For significant changes, we will provide a more prominent notice, which may include an email notification to the email address associated with your account.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>
          
          <section id="contact" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mb-4">
              QuestPanda<br />
              Email: privacy@questpanda.com<br />
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
