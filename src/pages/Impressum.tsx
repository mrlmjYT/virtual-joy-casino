import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MapPin, User, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Impressum = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Startseite
        </Button>

        <Card className="border-primary/20">
          <CardHeader className="space-y-2 border-b border-border">
            <CardTitle className="text-3xl text-gradient-gold">
              Impressum
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="w-4 h-4" />
              <span>Schulprojekt</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Schulprojekt Notice */}
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Hinweis: Schulprojekt
              </h3>
              <p className="text-sm text-muted-foreground">
                Diese Website wurde als Schulprojekt erstellt. 
                Der Betreiber ist Schüler und diese Plattform dient ausschließlich 
                zu Bildungs- und Demonstrationszwecken. Es werden keine echten 
                Glücksspiele angeboten und es kann kein echtes Geld gewonnen oder 
                verloren werden.
              </p>
            </div>

            {/* Angaben gemäß §5 TMG */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Angaben gemäß §5 TMG
              </h2>
              <div className="space-y-2 text-muted-foreground">
                <p className="flex items-start gap-2">
                  <User className="w-4 h-4 mt-1 text-primary" />
                  <span>
                    <strong>Name:</strong> Lukas Brunenr
                  </span>
                </p>
              </div>
            </section>

            {/* Kontakt */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Kontakt
              </h2>
              <div className="space-y-2 text-muted-foreground">
                <p className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-1 text-primary" />
                  <span>
                    <strong>E-Mail:</strong>{" "}
                    <a 
                      href="mailto:mr.lmj.email@gmail.com"
                      className="text-primary hover:underline"
                    >
                      mr.lmj.email@gmail.com
                    </a>
                  </span>
                </p>
              </div>
            </section>

            {/* Haftungsausschluss */}
            <section>
              <h2 className="text-xl font-bold mb-4">Haftungsausschluss</h2>
              
              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Haftung für Inhalte</h3>
                  <p>
                    Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. 
                    Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch 
                    keine Gewähr übernommen werden. Als Diensteanbieter bin ich gemäß § 7 Abs.1 TMG 
                    für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. 
                    Als Schüler und im Rahmen eines Schulprojekts wird jedoch darauf hingewiesen, 
                    dass diese Website ausschließlich zu Bildungszwecken dient.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Haftung für Links</h3>
                  <p>
                    Diese Website enthält Links zu externen Webseiten Dritter, auf deren Inhalte 
                    ich keinen Einfluss habe. Deshalb kann für diese fremden Inhalte auch keine 
                    Gewähr übernommen werden. Für die Inhalte der verlinkten Seiten ist stets der 
                    jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Urheberrecht</h3>
                  <p>
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten 
                    unterliegen dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung, 
                    Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes 
                    bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. 
                    Alle verwendeten Assets (Grafiken, Sounds, Code) stehen unter kommerziell nutzbarer 
                    Open-Source-Lizenz (MIT, Apache 2.0, CC0).
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Datenschutz</h3>
                  <p>
                    Die Nutzung dieser Website ist in der Regel ohne Angabe personenbezogener Daten möglich. 
                    Soweit auf diesen Seiten personenbezogene Daten erhoben werden, erfolgt dies auf 
                    freiwilliger Basis. Diese Daten werden ohne ausdrückliche Zustimmung nicht an Dritte 
                    weitergegeben. Im Rahmen dieses Schulprojekts werden Daten nur zu Demonstrationszwecken 
                    gespeichert und nicht kommerziell genutzt.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Glücksspiel-Hinweis</h3>
                  <p>
                    Diese Website simuliert Casino-Spiele ausschließlich zu Unterhaltungszwecken. 
                    Es werden keine echten Geldgewinne ausgezahlt und es besteht kein finanzielles Risiko. 
                    Alle Spiele verwenden virtuelles Spielgeld. Diese Plattform richtet sich nicht an 
                    Personen unter 18 Jahren, auch wenn es sich um ein Schulprojekt handelt. 
                    Glücksspiel kann süchtig machen - Hilfe unter www.spielsuchthilfe.at
                  </p>
                </div>
              </div>
            </section>

            {/* Footer Note */}
            <div className="pt-6 border-t border-border text-center text-sm text-muted-foreground">
              <p>Stand: Oktober 2025</p>
              <p className="mt-2">Erstellt im Rahmen eines Schulprojekts in Österreich</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Impressum;