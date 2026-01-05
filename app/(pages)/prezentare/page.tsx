/* eslint-disable @next/next/no-img-element */
import PageTitle from "@/app/components/pagetitle/pagetitle";
import PageBody from "@/app/components/pagebody/pagebody";
import Footer from "@/app/components/footer/footer";
import React from "react";

export default function Prezentare() {
    return (
        <div>
            <PageBody>
                <PageTitle text="PREZENTARE"></PageTitle>
                
                <div className="w-full mt-16 lg:mt-24 flex flex-col lg:flex-row lg:mb-0 -mb-10 gap-6">
                    <div className="w-full lg:min-w-[650px]">
                        <img 
                            className="w-full lg:min-w-[650px] lg:h-[365px] h-auto rounded-2xl shadow-lg border-2 border-gray-200 object-cover" 
                            src="/websiteUI/poza-cladire-cns-vech.png" 
                            alt="Poza Cladire CNS" 
                        />
                    </div>
                    <div className="flex flex-col justify-center lg:ml-8">
                        <h1 className="text-4xl lg:text-6xl text-center lg:text-left font-bold mt-5 lg:mt-0 text-indigo-900">SCURT ISTORIC</h1>
                        <p className="text-lg lg:text-xl mt-4 text-justify lg:text-left leading-relaxed">
                            Începuturile celui mai vechi liceu din Zalău, din județul Sălaj, își au rădăcinile în prima jumătate a secolului al XVII-lea: în anul 1646, la Zalău deja funcționa un gimnaziu reformat (calvinist). Din acest an este cunoscut numele primului rector al instituției, precum și numele elevilor înscriși la cursurile superioare. Acești elevi au fost înscriși în matricola școlii și prin aceasta, ei se angajau să respecte legile școlii. În primele secole, limba de predare a fost limba latină, apoi limba maghiară, iar din secolul trecut limbile română și maghiară.
                        </p>
                    </div>
                </div>
                
                <div className="w-full mt-16 lg:mt-24 flex flex-col lg:flex-row-reverse gap-6">
                    <div className="w-full lg:min-w-[650px]">
                        <img 
                            className="w-full lg:min-w-[650px] lg:h-[365px] h-auto rounded-2xl shadow-lg border-2 border-gray-200 object-cover" 
                            src="/websiteUI/Colegiul_Naţional__Silvania__Zalău%20(1).jpg" 
                            alt="Poza Cladire CNS" 
                        />
                    </div>
                    <div className="flex flex-col justify-center lg:mr-8">
                        <h1 className="text-4xl lg:text-6xl text-center lg:text-right font-bold mt-5 lg:mt-0 text-indigo-900">ARHITECTURA</h1>
                        <p className="text-lg lg:text-xl mt-4 text-justify lg:text-right leading-relaxed">
                            Construite practic în decurs de o jumătate de secol, cele trei clădiri istorice care sunt și monumente de arhitectură nu prezintă un stil unitar: corpul B și corpul C se încadrează undeva între stilul clasicist sau mai degrabă neoclasic. Această arhitectură este solemnă, dar în același timp mult mai simplă și mai funcțională+rațională, decât barocul: Astfel toate elementele corpului clădirilor care ies oarecum în relief – rezalitele (cum se numesc în arhitectura barocului) – dispar, iar fațadele devin impresionante prin unitatea lor și prin faptul că toate elementele ce le compun vor fi absolut în linie.
                        </p>
                    </div>
                </div>

                <div className="w-full mt-24 lg:mt-32">
                    <PageTitle text="VIZIUNEA CNS" />
                    <p className="text-lg lg:text-xl text-justify mt-12 lg:mt-20 leading-relaxed">
                        Colegiul Național „Silvania" - Zalău valorifică tradiția celor aproape patru secole de activitate în spațiul educațional sălăjean și promovează o educație modernă fundamentată pe valori și principii europene, la standarde de excelență. Colegiul Național „Silvania" - Zalău este liantul între tradiția umanist-științifică sălăjeană și idealul educațional construit pe valorile inalterabile ale democrației și pe aspirațiile societății românești. Urmărește crearea unui mediu educațional și social care să stimuleze încrederea, responsabilizarea, progresul elevilor și al profesorilor, deopotrivă. Scopul nostru este promovarea excelenței, în vederea dezvoltării plenare a fiecărui elev, astfel încât să se manifeste ca un cetățean activ și competitiv în societatea viitorului. De aceea, ne propunem formarea unor entități competente, motivate și creative, capabile de opțiune și decizie. Identitatea noastră înseamnă performanță, tradiție, diversitate, onoare și atașament față de Adevăr, Bine și Frumos – idealurile universale ale educației.
                    </p>
                </div>

                <Footer/>
            </PageBody>
        </div>
    );
}
