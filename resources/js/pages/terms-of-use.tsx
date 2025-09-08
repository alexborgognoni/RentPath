import { AppHeader } from '@/components/app-header';
import { Footer } from '@/components/landing/footer';

export default function TermsOfUse() {
    return (
        <div className="min-h-screen">
            <AppHeader />
            
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="prose prose-neutral mx-auto max-w-none dark:prose-invert">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Use</h1>
                    <p className="text-sm text-muted-foreground mb-8">Last updated: [Insert Date]</p>
                    
                    <div className="space-y-8 text-foreground">
                        <section>
                            <p className="text-lg leading-relaxed">
                                Welcome to RentPath. These Terms of Use ("Terms") govern your access to and use of RentPath's website, platform, and services (collectively, the "Services"). By accessing or using the Services, you agree to be bound by these Terms. If you do not agree, you may not use the Services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Who We Are</h2>
                            <p>The Services are operated by RentPath ("we," "our," or "us"). Our contact details can be found in the <strong>Contact Us</strong> section below.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Eligibility</h2>
                            <p>You must be at least 18 years old and capable of entering into legally binding agreements to use the Services. By using RentPath, you represent and warrant that you meet these requirements.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Accounts</h2>
                            <ul className="space-y-2">
                                <li>To use certain features, you must create an account.</li>
                                <li>You agree to provide accurate and complete information when registering.</li>
                                <li>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</li>
                                <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Services Provided</h2>
                            <p className="mb-4">RentPath enables landlords, property managers, and tenants to manage rental applications, property information, and related communication.</p>
                            <p>We may add, modify, or discontinue features at our discretion.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Acceptable Use</h2>
                            <p className="mb-4">You agree not to use the Services to:</p>
                            <ul className="space-y-2">
                                <li>Submit false, misleading, or fraudulent information.</li>
                                <li>Upload or share unlawful, harmful, or infringing content.</li>
                                <li>Interfere with or disrupt the security or functionality of the Services.</li>
                                <li>Attempt to access data or systems without authorization.</li>
                            </ul>
                            <p className="mt-4">We reserve the right to suspend or terminate access if these rules are violated.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Payments</h2>
                            <p className="mb-4">If you purchase paid features or subscriptions:</p>
                            <ul className="space-y-2">
                                <li>Fees are stated in [currency] and must be paid in accordance with our billing policies.</li>
                                <li>All payments are non-refundable unless otherwise stated.</li>
                                <li>We may change pricing at any time with prior notice.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Intellectual Property</h2>
                            <p>All content, trademarks, and software associated with RentPath are our property or licensed to us. You may not copy, modify, distribute, or create derivative works without prior written consent.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Data & Privacy</h2>
                            <p>Our use of personal data is governed by our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>. By using the Services, you consent to our collection and processing of personal data as described therein.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Disclaimer of Warranties</h2>
                            <p>The Services are provided "as is" and "as available." We do not guarantee that the Services will be uninterrupted, error-free, or secure.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
                            <p className="mb-4">To the maximum extent permitted by law:</p>
                            <ul className="space-y-2">
                                <li>We shall not be liable for indirect, incidental, or consequential damages.</li>
                                <li>Our total liability for any claims relating to the Services shall not exceed the amount you paid us in the past 12 months.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Termination</h2>
                            <p>We may suspend or terminate your access at any time if you breach these Terms or misuse the Services. Upon termination, your right to use the Services will cease immediately.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to Terms</h2>
                            <p>We may update these Terms from time to time. The updated version will be posted on our website with the "Last updated" date revised. Continued use of the Services constitutes acceptance of the updated Terms.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Governing Law</h2>
                            <p>These Terms are governed by and construed in accordance with the laws of [Insert Country, e.g., Luxembourg/EU]. Any disputes will be subject to the exclusive jurisdiction of the courts in [Insert City/Country].</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                            <p className="mb-4">If you have questions about these Terms, please contact us:</p>
                            <div className="bg-muted/30 p-4 rounded-lg">
                                <p><strong>RentPath</strong><br />
                                [Insert Legal Entity Name]<br />
                                [Insert Business Address]<br />
                                Email: [Insert Contact Email]</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}