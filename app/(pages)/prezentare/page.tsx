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
                <div className="w-full h-[calc(100vw*9/16)  lg:h-[400px] mt-16 lg:mt-24 flex flex-col lg:flex-row lg:mb-0 -mb-10">
                    <div className="w-full h-[calc(100vw*9/16) lg:min-w-[650px]">
                        <img className="w-full h-[calc(100vw*9/16) lg:min-w-[650px] lg:h-[365px] rounded-2xl shadow-2xl border-2" src="/websiteUI/poza-cladire-cns-vech.png" alt="Poza Cladire CNS" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl lg:text-6xl text-center lg:text-left ml-0 lg:ml-10 font-bold mt-5 lg:-mt-5 text-indigo-900">SCURT ISTORIC</h1>
                        <h1 className="text-xl ml-0 lg:ml-10 mt-2 lg:text-left text-justify">Începuturile celui mai vechi liceu din Zalău, din judeţul Sălaj, îşi au rădăcinile în prima jumătate a secolului al XVII-lea: în anul 1646, la Zalău deja funcţiona un gimnaziu reformat (calvinist). Din acest an este cunoscut numele primului rector al instituţiei, precum şi numele elevilor înscrişi la cursurile superioare. Aceşti elevi au fost înscrişi în matricola şcolii şi prin aceasta, ei se angajau să respecte legile şcolii. În primele secole, limba de predare a fost limba latină, apoi limba maghiară, iar din secolul trecut limbile română şi maghiară.</h1>
                    </div>
                </div>
                <div className="w-full h-[calc(100vw*9/16) lg:h-[400px] mt-32 flex flex-col lg:flex-row">
                    <div className="w-full lg:min-w-[650px] lg:hidden">
                        <img className="w-full h-[calc(100vw*9/16) lg:min-w-[650px] lg:h-[365px] rounded-2xl border-2" src="/websiteUI/Colegiul_Naţional__Silvania__Zalău%20(1).jpg" alt="Poza Cladire CNS" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl lg:text-6xl mr-0 lg:mr-10 font-bold text-center lg:text-right mt-5 lg:-mt-5 text-indigo-900">ARHITECTURA</h1>
                        <h1 className="text-xl mr-0 lg:mr-10 lg:text-right mt-2 text-justify">Construite practic în decurs de o jumătate de secol, cele trei clădiri istorice care sunt şi monumente de arhitectură nu prezintă un stil unitar: corpul B şi corpul C se încadrează undeva între stilul clasicist sau mai degrabă neoclasic. Această arhitectura este solemnă, dar în acelaşi timp mult mai simplă şi mai funcţională+raţională, decât barocul: Astfel toate elementele corpului clădirilor care ies oarecum în relief – rezalitele (cum se numesc în arhitectura barocului) – dispar, iar fațadele devin impresionante prin unitatea lor și prin faptul că toate elementele ce le compun vor fi absolut în linie.</h1>
                    </div>
                    <div className="w-full lg:min-w-[650px] hidden lg:block">
                        <img className="w-full h-[calc(100vw*9/16) lg:min-w-[650px] lg:h-[365px] rounded-2xl shadow-2xl border-2" src="/websiteUI/Colegiul_Naţional__Silvania__Zalău%20(1).jpg" alt="Poza Cladire CNS" />
                    </div>

                </div>
                <div className="w-full">

                    <div className="hidden lg:block text-indigo-900">   <PageTitle text="VIZIUNEA CNS" /> </div>
                    <h1 className="text-4xl lg:text-6xl mr-0 lg:mr-10 font-bold text-center lg:text-right mt-20 lg:-mt-5 block lg:hidden">VIZIUNEA CNS</h1>
                    <p className="text-xl text-justify lg:text-center mt-10 lg:mt-20">Colegiul Naţional „Silvania”- Zalău valorifică tradiția celor aproape patru secole de activitate în spațiul educațional sălăjean și promovează o educație modernă fundamentată pe valori și principii europene, la standarde de excelență. Colegiul Naţional „Silvania” - Zalău este liantul între tradiţia umanist - ştiinţifică sălăjeană şi idealul educaţional construit pe valorile inalterabile ale democraţiei şi pe aspiraţiile societăţii româneşti. Urmăreşte crearea unui mediu educaţional şi social care să stimuleze încrederea, responsa bilizarea, progresul elevilor şi al profesorilor, deopotrivă. Scopul nostru este promovarea excelenţei, în vederea dezvoltării plenare a fiecărui elev, astfel încât să se manifeste ca un cetățean activ și competitiv în societatea viitorului. De aceea, ne propunem formarea unor entități competente, motivate și creative, capabile de opțiune și decizie.Identitatea noastră înseamnă performanţă, tradiţie, diversitate, onoare și ataşament faţă de Adevăr, Bine și Frumos – idealurile universale ale educației.

                    </p>

                </div>

                <Footer/>
            </PageBody>
        </div>
    );
}
