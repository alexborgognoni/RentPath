import { AppHeader } from '@/components/app-header';
import { Footer } from '@/components/landing/footer';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen">
            <AppHeader />
            
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="prose prose-neutral mx-auto max-w-none dark:prose-invert">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
                    <p className="text-sm text-muted-foreground mb-8">Last updated: [Insert Date]</p>
                    
                    <div className="space-y-8 text-foreground">
                        <section>
                            <p className="text-lg leading-relaxed">
                                RentPath ("we," "our," or "us") values your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information in accordance with the General Data Protection Regulation (GDPR) and other applicable data protection laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Who We Are (Data Controller)</h2>
                            <p className="mb-4">RentPath is the data controller responsible for your personal data.</p>
                            <div className="bg-muted/30 p-4 rounded-lg">
                                <p className="font-semibold mb-2">Contact Details:</p>
                                <p>RentPath<br />
                                [Insert Legal Entity Name]<br />
                                [Insert Business Address]<br />
                                Email: [Insert Privacy Email Address]</p>
                            </div>
                            <p className="mt-4">If you have questions about this Privacy Policy or how your data is handled, you can contact us at the email above.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
                            <p className="mb-4">We may collect and process the following categories of personal data:</p>
                            <ul className="space-y-2">
                                <li><strong>Account Information:</strong> Name, email address, phone number, login details.</li>
                                <li><strong>Tenant Application Data:</strong> Employment history, rental history, financial details (e.g., payslips, bank statements), identification documents, references.</li>
                                <li><strong>Property Management Data:</strong> Information about properties, leases, payments, and tenant occupancy.</li>
                                <li><strong>Communications:</strong> Messages exchanged through the platform.</li>
                                <li><strong>Usage Data:</strong> IP address, device information, browser type, operating system, activity logs.</li>
                                <li><strong>Cookies & Tracking Data:</strong> Information collected through cookies and similar technologies (see Section 9).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Lawful Bases for Processing</h2>
                            <p className="mb-4">We process your personal data only when we have a lawful basis under GDPR:</p>
                            <ul className="space-y-2">
                                <li><strong>Contract:</strong> To provide our Services and perform agreements with landlords, property managers, and tenants.</li>
                                <li><strong>Consent:</strong> Where you have given us explicit consent (e.g., for marketing communications, non-essential cookies).</li>
                                <li><strong>Legal Obligation:</strong> To comply with applicable laws, tax regulations, and recordkeeping requirements.</li>
                                <li><strong>Legitimate Interests:</strong> To improve our Services, prevent fraud, ensure security, and communicate essential updates (provided your rights do not override these interests).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Data</h2>
                            <p className="mb-4">We use personal data for the following purposes:</p>
                            <ul className="space-y-2">
                                <li>To create and manage user accounts.</li>
                                <li>To process tenant applications and facilitate communication between landlords, property managers, and tenants.</li>
                                <li>To manage rental properties, occupancy, and lease agreements.</li>
                                <li>To provide customer support and respond to inquiries.</li>
                                <li>To improve, monitor, and secure our Services.</li>
                                <li>To send important notifications regarding your account, applications, or legal obligations.</li>
                                <li>To comply with regulatory and legal requirements.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Sharing Your Data</h2>
                            <p className="mb-4">We do not sell your personal data. We may share it with:</p>
                            <ul className="space-y-2">
                                <li><strong>Landlords and property managers</strong> to process tenant applications and manage properties.</li>
                                <li><strong>Service providers</strong> (e.g., cloud hosting, payment processors, analytics tools) under strict confidentiality agreements.</li>
                                <li><strong>Regulatory authorities or legal bodies</strong> if required by law or to protect our rights.</li>
                            </ul>
                            <p className="mt-4">When we share data, we ensure appropriate contractual and technical safeguards are in place.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">International Data Transfers</h2>
                            <p className="mb-4">If we transfer personal data outside the European Economic Area (EEA), we will ensure appropriate safeguards, such as:</p>
                            <ul className="space-y-2">
                                <li>Transfers to countries with an <strong>adequacy decision</strong> by the European Commission.</li>
                                <li>Use of <strong>Standard Contractual Clauses (SCCs)</strong> approved by the European Commission.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Retention</h2>
                            <p>We retain personal data only as long as necessary to fulfill the purposes described in this Policy or as required by law. When no longer needed, data will be securely deleted or anonymized.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
                            <p className="mb-4">Under GDPR, you have the following rights regarding your personal data:</p>
                            <ul className="space-y-2">
                                <li><strong>Right of Access:</strong> Request a copy of the data we hold about you.</li>
                                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data.</li>
                                <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request deletion of your data when it is no longer necessary.</li>
                                <li><strong>Right to Restrict Processing:</strong> Request limitation of how we use your data.</li>
                                <li><strong>Right to Data Portability:</strong> Receive your data in a structured, commonly used, machine-readable format.</li>
                                <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or direct marketing.</li>
                                <li><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, you may withdraw it at any time.</li>
                                <li><strong>Right to Lodge a Complaint:</strong> You may file a complaint with your local Data Protection Authority.</li>
                            </ul>
                            <p className="mt-4">To exercise your rights, please contact us at: [Insert Privacy Email Address].</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies & Tracking Technologies</h2>
                            <p className="mb-4">We use cookies and similar technologies to:</p>
                            <ul className="space-y-2">
                                <li>Enable core site functionality.</li>
                                <li>Improve performance and security.</li>
                                <li>Analyze usage patterns.</li>
                                <li>Personalize your experience.</li>
                            </ul>
                            <p className="mt-4">For non-essential cookies, we will request your consent via a cookie banner in compliance with the ePrivacy Directive and GDPR. You can manage cookie preferences in your browser settings.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Security</h2>
                            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, misuse, or alteration. However, no method of transmission over the Internet is 100% secure.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Privacy Policy</h2>
                            <p>We may update this Privacy Policy from time to time. Any updates will be posted on this page with a revised "Last updated" date.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                            <p className="mb-4">If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us at:</p>
                            <div className="bg-muted/30 p-4 rounded-lg">
                                <p><strong>RentPath</strong><br />
                                [Insert Legal Entity Name]<br />
                                [Insert Business Address]<br />
                                Email: [Insert Privacy Email Address]</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}