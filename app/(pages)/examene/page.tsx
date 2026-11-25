import PageBody from "@/app/components/pagebody/pagebody";
import PageTitle from "@/app/components/pagetitle/pagetitle";
import Footer from "@/app/components/footer/footer";
import React from "react";
import FaqItem from "@/app/components/faq/faq";

type ExameneItem = {
    title: string;
    content?: string;
    documentUrl?: string;
    documentName?: string;
};

export default function Examene() {
    const examene: ExameneItem[] = [
        { title: 'Evaluarea Națională', content: 'Evaluarea Nationala este un examen important in sistemul de educatie din Romania, organizat la finalul clasei a VIII-a, care are rolul de a evalua cunostintele si competentele dobandite de elevi in timpul ciclului gimnazial. Acest examen include probe scrise la Limba si literatura romana, Matematica si, in unele cazuri, Limba materna, pentru elevii care au studiat intr-o limba a minoritatilor nationale. Rezultatele obtinute la Evaluarea Nationala sunt esentiale pentru admiterea in liceu, deoarece influenteaza media finala de admitere, alaturi de mediile generale obtinute in gimnaziu.' },
        { title: 'Bacalaureat', content: 'Bacalaureatul, cunoscut si sub numele de „examenul de maturitate,” este examenul final din sistemul de invatamant preuniversitar din Romania, sustinut de elevi la finalul clasei a XII-a. Acesta consta in mai multe probe, atat scrise, cat si orale, care acopera discipline diverse, precum Limba si literatura romana, Matematica sau Istoria, Limba straina si o proba la alegere in functie de profilul urmat in liceu (real sau umanist). Bacalaureatul are o importanta majora in cariera educationala a elevilor, deoarece nota finala influenteaza admiterea la facultate si oportunitatile de viitor.' },
        {
            title: 'Admitere Clasa a 5-a',
            documentUrl: '/uploads/documents/examene/subiecte-bareme-admitere-clasa-5a.pdf',
            documentName: 'Subiecte + Bareme, anii 2024, 2025, 2026.pdf',
        },
    ];
    const concursuri = [
        { title: 'Cambridge', content: 'Colegiul Național „Silvania” este certifcat centru de pregătire și testare examene Cambridge în colaborare cu centrul autorizat EECentre București din anul 2022. Anual, catedra de limba engleză pregătește elevii colegiului pentru a susține probele din examenele internaționale, de la cel mai înalt nivel (Proficiency C2) până la nivelul B2 (English Preliminary). Sute de elevi sunt performanți și își echivalează competențele lingvistice de limba engleză din cadrul examenului de bacalaureat, dar și sunt mândri posesori ai unei diplome cu recunoaștere internațională, un document necesar pentru înscrierea la examene de licențî, la admitere de studii masterat precum și pentru continuarea studiilor universitare în străinătate.' },
        { title: 'ECDL', content: 'Colegiul National "SILVANIA" este un centru certificat pentru examenul ECDL' },
        { title: 'DSD', content: 'Colegiul National "SILVANIA" este un centru certificat pentru examenul DSD' },
        { title: 'DELF', content: 'Colegiul National "SILVANIA" este un centru certificat pentru examenul DELF' }
    ];

    return (
        <div>
            <PageBody>
                <PageTitle text="EXAMENE ȘI CONCURSURI"/>
                <div className="lg:w-[1000px] w-full self-center mt-16 lg:mt-24 shadow-lg bg-brand-paper p-6 lg:p-8 rounded-2xl border-2 border-gray-200">

                    <h2 className="text-3xl lg:text-4xl font-bold text-indigo-900 mb-6">Examene</h2>
                    <hr className="border-t-2 border-gray-200" />

                    {examene.map((faq, index) => (
                        <FaqItem
                            key={index}
                            title={faq.title}
                            content={faq.content}
                            documentUrl={faq.documentUrl}
                            documentName={faq.documentName}
                        />
                    ))}

                    <h2 className="text-3xl lg:text-4xl font-bold text-indigo-900 mb-6 mt-8">Concursuri</h2>
                    <hr className="border-t-2 border-gray-200" />

                    {concursuri.map((faq, index) => (
                        <FaqItem key={index} title={faq.title} content={faq.content} />
                    ))}

                </div>

                <Footer/>

            </PageBody>
        </div>
    );
}
