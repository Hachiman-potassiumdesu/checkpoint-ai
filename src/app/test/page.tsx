import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestPage() {
  return (
    <div className="container flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Page</CardTitle>
          <CardDescription>
            If you can see this, you are authenticated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This page is only accessible to signed-in users.</p>
        </CardContent>
      </Card>
    </div>
  );
}
