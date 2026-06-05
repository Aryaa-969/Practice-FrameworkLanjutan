import React from "react";
import PageHeader from "../components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FiturXyz() {
    return (
        <div>
            <PageHeader
            title="Fitur XYZ"
            breadcrumb={["Home", "Fitur XYZ"]} />
        
            <div className="my-5">
                <Button variant="outline">Batal</Button>
                <Button variant="ghost">Batal</Button>
                <Button variant="destructive">Batal</Button>
                <Button variant="link">Batal</Button>
                <Button variant="secondary">Simpan</Button>
                <Button variant="default">Simpan</Button>
            </div>
            

            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>This is a description for the card.</CardDescription>
                </CardHeader>
            </Card>

            <div className="my-5">
                <Badge variant="default">Badge</Badge>
                <Badge variant="secondary">Badge</Badge>
                <Badge variant="destructive">Badge</Badge>
                <Badge variant="outline">Badge</Badge>
                <Badge variant="ghost">Badge</Badge>
                <Badge variant="link">Badge</Badge>
            </div>
            
            <Card className="mt-4 w-[380px]">
                <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Belajar shadcn/ui</CardTitle>
                    <Badge variant="secondary">Baru</Badge>
                </div>
                <CardDescription>
                    Contoh penggunaan komponen shadcn/ui di React
                </CardDescription>
                </CardHeader>

                <CardContent>
                <p className="text-sm text-muted-foreground">
                    Komponen ini dibuat di branch <strong>setup-shadcn</strong>
                    lalu di-merge ke main.
                </p>
                </CardContent>

                <CardFooter className="flex gap-2">
                <Button>Simpan</Button>
                <Button variant="outline">Batal</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
