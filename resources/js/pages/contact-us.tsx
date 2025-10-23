import { PublicLayout } from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';

export default function ContactUs() {
    const page = usePage<SharedData>();
    const { translations } = page.props;

    // Contact information constants
    const CONTACT_INFO = {
        email: 'contact@rentpath.app',
        phone: '+352 661 290 897',
        address: '4, rue de Drusenheim',
        city: 'L-3884 Schifflange',
        country: 'Luxembourg'
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
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
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <PublicLayout>
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-foreground mb-4">{translate(translations, 'contact-us.page_title')}</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {translate(translations, 'contact-us.page_subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Information */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-primary" />
                                        {translate(translations, 'contact-us.contact_info.email.title')}
                                    </CardTitle>
                                    <CardDescription>
                                        {translate(translations, 'contact-us.contact_info.email.description')}
                                    </CardDescription>
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
                                    <CardDescription>
                                        {translate(translations, 'contact-us.contact_info.phone.description')}
                                    </CardDescription>
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
                                    <CardDescription>
                                        {translate(translations, 'contact-us.contact_info.address.description')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-medium text-foreground">
                                        {CONTACT_INFO.address}<br />
                                        {CONTACT_INFO.city}<br />
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
                                <CardDescription>
                                    {translate(translations, 'contact-us.form.description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-full flex flex-col">
                                {isSubmitted ? (
                                    <div className="text-center py-8 flex-1 flex flex-col justify-center">
                                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mb-4 mx-auto">
                                            <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">{translate(translations, 'contact-us.success.title')}</h3>
                                        <p className="text-muted-foreground mb-6">
                                            {translate(translations, 'contact-us.success.description')}
                                        </p>
                                        <Button
                                            onClick={() => setIsSubmitted(false)}
                                            variant="outline"
                                            className="mx-auto"
                                        >
                                            {translate(translations, 'contact-us.success.send_another_button')}
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                        
                                        <div className="space-y-2 flex-1 flex flex-col">
                                            <Label htmlFor="message">{translate(translations, 'contact-us.form.fields.message.label')}</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder={translate(translations, 'contact-us.form.fields.message.placeholder')}
                                                className="flex-1 min-h-[120px] resize-none"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full cursor-pointer text-text-primary rounded-lg bg-gradient-to-r from-primary to-secondary px-8 text-center text-lg font-semibold shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? translate(translations, 'contact-us.form.submitting_button') : translate(translations, 'contact-us.form.submit_button')}
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