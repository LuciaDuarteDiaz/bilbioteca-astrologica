// Ejemplo básico para probarlo
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TestCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hola mundo</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Este es el contenido.</p>
      </CardContent>
    </Card>
  );
}
