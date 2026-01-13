import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PublicLayout } from '@/layouts/public-layout';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

export default function ContactUs() {
    const page = usePage<SharedData>();
    const { translations } = page.props;

    // Contact information constants
    const CONTACT_INFO = {
        email: 'contact@rentpath.app',
        phone: '+352 661 290 897',
        address: '4, rue de Drusenheim',
        city: 'L-3884 Schifflange',
        country: 'Luxembourg',
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 2000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <PublicLayout>
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-foreground">{translate(translations, 'contact-us.page_title')}</h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{translate(translations, 'contact-us.page_subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Contact Information */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-primary" />
                                        {translate(translations, 'contact-us.contact_info.email.title')}
                                    </CardTitle>
                                    <CardDescription>{translate(translations, 'contact-us.contact_info.email.description')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-medium text-foreground">{CONTACT_INFO.email}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-primary" />
                                        {translate(translations, 'contact-us.contact_info.phone.title')}
                                    </CardTitle>
                                    <CardDescription>{translate(translations, 'contact-us.contact_info.phone.description')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-medium text-foreground">{CONTACT_INFO.phone}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        {translate(translations, 'contact-us.contact_info.address.title')}
                                    </CardTitle>
                                    <CardDescription>{translate(translations, 'contact-us.contact_info.address.description')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-medium text-foreground">
                                        {CONTACT_INFO.address}
                                        <br />
                                        {CONTACT_INFO.city}
                                        <br />
                                        {CONTACT_INFO.country}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>{translate(translations, 'contact-us.form.title')}</CardTitle>
                                <CardDescription>{translate(translations, 'contact-us.form.description')}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex h-full flex-col">
                                {isSubmitted ? (
                                    <div className="flex flex-1 flex-col justify-center py-8 text-center">
                                        <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                                            <Mail className="h-8 w-8 text-success" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold text-foreground">
                                            {translate(translations, 'contact-us.success.title')}
                                        </h3>
                                        <p className="mb-6 text-muted-foreground">{translate(translations, 'contact-us.success.description')}</p>
                                        <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mx-auto">
                                            {translate(translations, 'contact-us.success.send_another_button')}
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="flex flex-1 flex-col space-y-6">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">{translate(translations, 'contact-us.form.fields.name.label')}</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    placeholder={translate(translations, 'contact-us.form.fields.name.placeholder')}
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">{translate(translations, 'contact-us.form.fields.email.label')}</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder={translate(translations, 'contact-us.form.fields.email.placeholder')}
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">{translate(translations, 'contact-us.form.fields.subject.label')}</Label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                type="text"
                                                placeholder={translate(translations, 'contact-us.form.fields.subject.placeholder')}
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="flex flex-1 flex-col space-y-2">
                                            <Label htmlFor="message">{translate(translations, 'contact-us.form.fields.message.label')}</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder={translate(translations, 'contact-us.form.fields.message.placeholder')}
                                                className="min-h-[120px] flex-1 resize-none"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="text-text-primary w-full cursor-pointer rounded-lg bg-gradient-to-r from-primary to-secondary px-8 text-center text-lg font-semibold shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting
                                                ? translate(translations, 'contact-us.form.submitting_button')
                                                : translate(translations, 'contact-us.form.submit_button')}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
