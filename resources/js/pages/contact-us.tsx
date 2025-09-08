import { AppHeader } from '@/components/app-header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

export default function ContactUs() {
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
        <div className="min-h-screen">
            <AppHeader />
            
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Have a question or need help? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
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
                                        Email Us
                                    </CardTitle>
                                    <CardDescription>
                                        Send us an email anytime and we'll get back to you.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-medium text-foreground">support@rentpath.com</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-primary" />
                                        Call Us
                                    </CardTitle>
                                    <CardDescription>
                                        Mon-Fri from 9am to 6pm CET
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-medium text-foreground">+352 XX XX XX XX</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        Visit Us
                                    </CardTitle>
                                    <CardDescription>
                                        Come say hello at our office headquarters.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-medium text-foreground">
                                        [Insert Address]<br />
                                        Luxembourg City<br />
                                        Luxembourg
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Send us a message</CardTitle>
                                <CardDescription>
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-full flex flex-col">
                                {isSubmitted ? (
                                    <div className="text-center py-8 flex-1 flex flex-col justify-center">
                                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mb-4 mx-auto">
                                            <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Message Sent!</h3>
                                        <p className="text-muted-foreground mb-6">
                                            Thank you for contacting us. We'll get back to you within 24 hours.
                                        </p>
                                        <Button
                                            onClick={() => setIsSubmitted(false)}
                                            variant="outline"
                                            className="mx-auto"
                                        >
                                            Send Another Message
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    placeholder="Your name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="your.email@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                type="text"
                                                placeholder="What's this about?"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        
                                        <div className="space-y-2 flex-1 flex flex-col">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder="Tell us more about your question or how we can help..."
                                                className="flex-1 min-h-[120px] resize-none"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        
                                        <Button
                                            type="submit"
                                            className="w-full cursor-pointer text-white"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Sending...' : 'Send Message'}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}