import { Header } from '~/components/app-header';

import { AccountSections } from './_components/account-sections';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';

export default function Account() {
  return (
    <div className="h-full w-full overflow-hidden overflow-y-auto rounded-lg bg-neutral-900">
      <Header className="from-bg-neutral-900">
        <h1 className="mb-2 text-3xl font-semibold text-white">Account</h1>
      </Header>
      <AccountSections />
      <div className="mt-4 px-6">
        <p className="text-sm text-neutral-300">
          Need technical support? Please email inquiries to: <a href="mailto:fountainhousestudio@gmail.com" className="underline text-blue-400">fountainhousestudio@gmail.com</a>
        </p>
      </div>
      <div className="mt-8 rounded-lg bg-neutral-800 p-6 text-neutral-300">
        <h2 className="mb-2 text-xl font-semibold text-white">Terms and Conditions</h2>
        <p className="mb-4 text-sm">
          By using this service, you agree to abide by all applicable laws and regulations. For more details, please review the full Terms and Conditions below.
        </p>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="terms">
            <AccordionTrigger className="text-base text-white">Read Full Terms and Conditions</AccordionTrigger>
            <AccordionContent>
              <div className="text-neutral-300 text-sm space-y-4">
                <h3 className="text-lg font-semibold text-white">Terms of Service &amp; User Agreement</h3>
                <p className="text-xs text-neutral-400">Effective Date: September 5, 20025</p>
                <p>
                  Welcome to the official music streaming platform of Literal Life Church, a 501(c)(3) nonprofit organization. Please read the following Terms of Service (“Agreement”) carefully before subscribing. By creating an account, accessing, or using our platform, you acknowledge that you have read, understood, and agree to be bound by the terms outlined below.
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    <strong>Purpose of the Platform</strong><br />
                    This platform exists to stream music created, recorded, and curated by Literal Life Church for the purpose of worship, encouragement, and spiritual growth. All music is the property of the church and is made available for personal, non-commercial use only.
                  </li>
                  <li>
                    <strong>Nonprofit Status</strong><br />
                    Literal Life Church is a registered 501(c)(3) nonprofit organization. All subscription revenue is used solely to support the church’s music ministry, including recording, production, equipment, and outreach. No part of the revenue is distributed for personal profit or financial gain.
                  </li>
                  <li>
                    <strong>Subscription Terms</strong><br />
                    Access to the platform requires an active paid subscription.<br />
                    Subscription fees are collected on a recurring basis (monthly).<br />
                    By subscribing, you authorize the platform to charge your payment method on a recurring basis until you cancel.<br />
                    All payments are considered donations to the church's music ministry and are non-refundable.
                  </li>
                  <li>
                    <strong>Cancellation Policy</strong><br />
                    You may cancel your subscription at any time through your account settings.<br />
                    Upon cancellation, you will retain access to the platform for the remainder of your billing period.<br />
                    Refunds are not issued for partial billing cycles or unused time.
                  </li>
                  <li>
                    <strong>Acceptable Use</strong><br />
                    You agree not to:
                    <ul className="list-disc list-inside ml-4">
                      <li>Share your account login with others</li>
                      <li>Copy, download, record, or redistribute any content from the platform</li>
                      <li>Use the platform or its content for commercial purposes</li>
                      <li>Attempt to interfere with or disrupt the platform's functionality or security</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Intellectual Property</strong><br />
                    All music, recordings, graphics, and materials made available through the platform are owned by the Literal Life Church community and protected by applicable copyright laws. You are granted a limited, non-exclusive, non-transferable license to stream content solely for personal, non-commercial purposes.
                  </li>
                  <li>
                    <strong>Modifications to Terms</strong><br />
                    We reserve the right to update or modify these Terms at any time. If changes are made, we will notify users via email or through the app. Continued use of the platform following any changes constitutes acceptance of those changes.
                  </li>
                  <li>
                    <strong>Privacy Policy</strong><br />
                    We are committed to protecting your privacy. Personal information collected during registration and use is used solely for account administration and communication related to the platform. We do not sell or share your personal data with third parties.
                  </li>
                </ol>
                <p>
                  By registering for an account or continuing to use the platform, you acknowledge that you have read and agree to abide by the above Terms of Service.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
