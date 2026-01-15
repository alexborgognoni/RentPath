/**
 * Size Reference Component
 *
 * Visual reference for the design system's size scale.
 * Use this during development to ensure consistent sizing.
 *
 * Usage: Import and render in a dev/storybook context
 */

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Plus, Search } from 'lucide-react';

export function SizeReference() {
    return (
        <div className="space-y-12 p-8">
            {/* Component Heights */}
            <section>
                <h2 className="mb-6 text-xl font-semibold">Component Heights (8px Grid)</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-2 text-left">Size</th>
                                <th className="px-4 py-2 text-left">Height</th>
                                <th className="px-4 py-2 text-left">Tailwind</th>
                                <th className="px-4 py-2 text-left">Use Case</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="px-4 py-2 font-medium">sm</td>
                                <td className="px-4 py-2">32px</td>
                                <td className="px-4 py-2 font-mono text-xs">h-8</td>
                                <td className="px-4 py-2 text-muted-foreground">Compact toolbars, dense tables</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-2 font-medium">md</td>
                                <td className="px-4 py-2">36px</td>
                                <td className="px-4 py-2 font-mono text-xs">h-9</td>
                                <td className="px-4 py-2 text-muted-foreground">Default forms, buttons</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-2 font-medium">lg</td>
                                <td className="px-4 py-2">44px</td>
                                <td className="px-4 py-2 font-mono text-xs">h-11</td>
                                <td className="px-4 py-2 text-muted-foreground">Hero CTAs, touch targets</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Buttons */}
            <section>
                <h2 className="mb-6 text-xl font-semibold">Buttons</h2>
                <div className="space-y-4">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">sm (32px)</p>
                            <Button size="sm">
                                <Plus /> Add Item
                            </Button>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">md (36px) - default</p>
                            <Button size="md">
                                <Plus /> Add Item
                            </Button>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">lg (44px)</p>
                            <Button size="lg">
                                <Plus /> Add Item
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">icon-sm (32px)</p>
                            <Button size="icon-sm" variant="outline">
                                <Bell />
                            </Button>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">icon-md (36px)</p>
                            <Button size="icon-md" variant="outline">
                                <Bell />
                            </Button>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">icon-lg (44px)</p>
                            <Button size="icon-lg" variant="outline">
                                <Bell />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Inputs */}
            <section>
                <h2 className="mb-6 text-xl font-semibold">Inputs</h2>
                <div className="flex flex-wrap items-end gap-4">
                    <div className="w-64 space-y-1">
                        <p className="text-xs text-muted-foreground">sm (32px)</p>
                        <Input size="sm" placeholder="Small input" />
                    </div>
                    <div className="w-64 space-y-1">
                        <p className="text-xs text-muted-foreground">md (36px) - default</p>
                        <Input size="md" placeholder="Medium input" />
                    </div>
                    <div className="w-64 space-y-1">
                        <p className="text-xs text-muted-foreground">lg (44px)</p>
                        <Input size="lg" placeholder="Large input" />
                    </div>
                </div>
            </section>

            {/* Textareas */}
            <section>
                <h2 className="mb-6 text-xl font-semibold">Textareas</h2>
                <div className="flex flex-wrap items-start gap-4">
                    <div className="w-64 space-y-1">
                        <p className="text-xs text-muted-foreground">sm</p>
                        <Textarea size="sm" placeholder="Small textarea" />
                    </div>
                    <div className="w-64 space-y-1">
                        <p className="text-xs text-muted-foreground">md - default</p>
                        <Textarea size="md" placeholder="Medium textarea" />
                    </div>
                    <div className="w-64 space-y-1">
                        <p className="text-xs text-muted-foreground">lg</p>
                        <Textarea size="lg" placeholder="Large textarea" />
                    </div>
                </div>
            </section>

            {/* Badges */}
            <section>
                <h2 className="mb-6 text-xl font-semibold">Badges</h2>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">sm</p>
                        <Badge size="sm">Small</Badge>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">md - default</p>
                        <Badge size="md">Medium</Badge>
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="muted">Muted</Badge>
                </div>
            </section>

            {/* Avatars */}
            <section>
                <h2 className="mb-6 text-xl font-semibold">Avatars</h2>
                <div className="flex flex-wrap items-end gap-4">
                    <div className="space-y-1 text-center">
                        <Avatar size="xs">
                            <AvatarFallback>XS</AvatarFallback>
                        </Avatar>
                        <p className="text-xs text-muted-foreground">xs (24px)</p>
                    </div>
                    <div className="space-y-1 text-center">
                        <Avatar size="sm">
                            <AvatarFallback>SM</AvatarFallback>
                        </Avatar>
                        <p className="text-xs text-muted-foreground">sm (32px)</p>
                    </div>
                    <div className="space-y-1 text-center">
                        <Avatar size="md">
                            <AvatarFallback>MD</AvatarFallback>
                        </Avatar>
                        <p className="text-xs text-muted-foreground">md (40px)</p>
                    </div>
                    <div className="space-y-1 text-center">
                        <Avatar size="lg">
                            <AvatarFallback>LG</AvatarFallback>
                        </Avatar>
                        <p className="text-xs text-muted-foreground">lg (48px)</p>
                    </div>
                    <div className="space-y-1 text-center">
                        <Avatar size="xl">
                            <AvatarFallback>XL</AvatarFallback>
                        </Avatar>
                        <p className="text-xs text-muted-foreground">xl (64px)</p>
                    </div>
                </div>
            </section>

            {/* Icon Sizes */}
            <section>
                <h2 className="mb-6 text-xl font-semibold">Icon Sizes</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-2 text-left">Size</th>
                                <th className="px-4 py-2 text-left">Dimension</th>
                                <th className="px-4 py-2 text-left">Tailwind</th>
                                <th className="px-4 py-2 text-left">Pair With</th>
                                <th className="px-4 py-2 text-left">Example</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="px-4 py-2 font-medium">xs</td>
                                <td className="px-4 py-2">12px</td>
                                <td className="px-4 py-2 font-mono text-xs">size-3</td>
                                <td className="px-4 py-2 text-muted-foreground">text-xs, badges</td>
                                <td className="px-4 py-2">
                                    <Search className="size-3" />
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-2 font-medium">sm</td>
                                <td className="px-4 py-2">16px</td>
                                <td className="px-4 py-2 font-mono text-xs">size-4</td>
                                <td className="px-4 py-2 text-muted-foreground">text-sm, default buttons</td>
                                <td className="px-4 py-2">
                                    <Search className="size-4" />
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-2 font-medium">md</td>
                                <td className="px-4 py-2">20px</td>
                                <td className="px-4 py-2 font-mono text-xs">size-5</td>
                                <td className="px-4 py-2 text-muted-foreground">text-base, large buttons</td>
                                <td className="px-4 py-2">
                                    <Search className="size-5" />
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-2 font-medium">lg</td>
                                <td className="px-4 py-2">24px</td>
                                <td className="px-4 py-2 font-mono text-xs">size-6</td>
                                <td className="px-4 py-2 text-muted-foreground">text-lg, headers</td>
                                <td className="px-4 py-2">
                                    <Search className="size-6" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Spacing Scale */}
            <section>
                <h2 className="mb-6 text-xl font-semibold">Spacing Scale (Semantic)</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-2 text-left">Token</th>
                                <th className="px-4 py-2 text-left">Value</th>
                                <th className="px-4 py-2 text-left">Use</th>
                                <th className="px-4 py-2 text-left">Visual</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="px-4 py-2 font-mono text-xs">gap-2</td>
                                <td className="px-4 py-2">8px</td>
                                <td className="px-4 py-2 text-muted-foreground">Tight grouping (buttons in row)</td>
                                <td className="px-4 py-2">
                                    <div className="h-4 w-2 bg-primary" />
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-2 font-mono text-xs">gap-3</td>
                                <td className="px-4 py-2">12px</td>
                                <td className="px-4 py-2 text-muted-foreground">Form field spacing</td>
                                <td className="px-4 py-2">
                                    <div className="h-4 w-3 bg-primary" />
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-2 font-mono text-xs">gap-4</td>
                                <td className="px-4 py-2">16px</td>
                                <td className="px-4 py-2 text-muted-foreground">Card content spacing</td>
                                <td className="px-4 py-2">
                                    <div className="h-4 w-4 bg-primary" />
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-2 font-mono text-xs">gap-6</td>
                                <td className="px-4 py-2">24px</td>
                                <td className="px-4 py-2 text-muted-foreground">Section spacing</td>
                                <td className="px-4 py-2">
                                    <div className="h-4 w-6 bg-primary" />
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-2 font-mono text-xs">gap-8</td>
                                <td className="px-4 py-2">32px</td>
                                <td className="px-4 py-2 text-muted-foreground">Major section breaks</td>
                                <td className="px-4 py-2">
                                    <div className="h-4 w-8 bg-primary" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Container Padding */}
            <section>
                <h2 className="mb-6 text-xl font-semibold">Container Padding</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-2 text-left">Context</th>
                                <th className="px-4 py-2 text-left">Padding</th>
                                <th className="px-4 py-2 text-left">Class</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="px-4 py-2">Badge</td>
                                <td className="px-4 py-2">8px × 4px</td>
                                <td className="px-4 py-2 font-mono text-xs">px-2 py-0.5</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-2">Button sm</td>
                                <td className="px-4 py-2">12px × 6px</td>
                                <td className="px-4 py-2 font-mono text-xs">px-3 py-1.5</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-2">Button md</td>
                                <td className="px-4 py-2">16px × 8px</td>
                                <td className="px-4 py-2 font-mono text-xs">px-4 py-2</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-2">Card</td>
                                <td className="px-4 py-2">24px</td>
                                <td className="px-4 py-2 font-mono text-xs">p-6</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-2">Modal</td>
                                <td className="px-4 py-2">24px</td>
                                <td className="px-4 py-2 font-mono text-xs">p-6</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-2">Page</td>
                                <td className="px-4 py-2">16px mobile, 24px desktop</td>
                                <td className="px-4 py-2 font-mono text-xs">px-4 sm:px-6</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Inline Example */}
            <section>
                <h2 className="mb-6 text-xl font-semibold">Inline Button + Input Alignment</h2>
                <p className="mb-4 text-sm text-muted-foreground">All sizes align horizontally when used together:</p>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Input size="sm" placeholder="Search..." className="w-64" />
                        <Button size="sm">
                            <Search /> Search
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input size="md" placeholder="Search..." className="w-64" />
                        <Button size="md">
                            <Search /> Search
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input size="lg" placeholder="Search..." className="w-64" />
                        <Button size="lg">
                            <Search /> Search
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
