import PageBody from "@/app/components/pagebody/pagebody";
import PageTitle from "@/app/components/pagetitle/pagetitle";
import Footer from "@/app/components/footer/footer";
import DocumentList from "@/app/components/displaydocuments/displaydocuments";
import React from "react";
import FaqItem from "@/app/components/faq/faq";


export default function Examene() {
    const examene = [
        { title: 'Evaluarea Națională', content: 'Evaluarea Nationala este un examen important in sistemul de educatie din Romania, organizat la finalul clasei a VIII-a, care are rolul de a evalua cunostintele si competentele dobandite de elevi in timpul ciclului gimnazial. Acest examen include probe scrise la Limba si literatura romana, Matematica si, in unele cazuri, Limba materna, pentru elevii care au studiat intr-o limba a minoritatilor nationale. Rezultatele obtinute la Evaluarea Nationala sunt esentiale pentru admiterea in liceu, deoarece influenteaza media finala de admitere, alaturi de mediile generale obtinute in gimnaziu.' },
        { title: 'Bacalaureat', content: 'Bacalaureatul, cunoscut si sub numele de „examenul de maturitate,” este examenul final din sistemul de invatamant preuniversitar din Romania, sustinut de elevi la finalul clasei a XII-a. Acesta consta in mai multe probe, atat scrise, cat si orale, care acopera discipline diverse, precum Limba si literatura romana, Matematica sau Istoria, Limba straina si o proba la alegere in functie de profilul urmat in liceu (real sau umanist). Bacalaureatul are o importanta majora in cariera educationala a elevilor, deoarece nota finala influenteaza admiterea la facultate si oportunitatile de viitor.' },
        { title: 'Admitere Clasa a 5-a', content: 'Admiterea in clasa a V-a este un proces important in sistemul de invatamant din Romania, care marcheaza trecerea elevilor de la ciclul gimnazial inferior la cel superior. De obicei, admiterea se desfasoara la licee sau scoli speciale, unde se pot solicita probe de evaluare a cunostintelor la materii precum Limba si literatura romana, Matematica si alte discipline relevante, in functie de specificul institutiei. Elevii care doresc sa se inscrie la aceste unitati de invatamant trebuie sa demonstreze nu doar competente academice, ci si motivatie si aptitudini pentru domeniul ales, iar rezultatele obtinute in cadrul examenelor influenteaza semnificativ optiunile de admitere. Aceasta etapa reprezinta o oportunitate pentru elevi de a-si continua studiile intr-un mediu mai specializat si provocator.' },
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
                <div className="lg:w-[1000px] w-full self-center mt-16 lg:mt-24 shadow-2xl p-10 rounded-2xl border-2">

                    <p className="lg:text-5xl text-3xl font-bold text-indigo-900 mb-4">Examene</p>
                    <hr className="solid border-t-2 mt-2" />

                    {examene.map((faq, index) => (
                        <FaqItem key={index} title={faq.title} content={faq.content} />
                    ))}

                    <p className="lg:text-5xl text-3xl font-bold text-indigo-900 mb-4 mt-6 ">Concursuri</p>
                    <hr className="solid border-t-2 mt-2" />

                    {concursuri.map((faq, index) => (
                        <FaqItem key={index} title={faq.title} content={faq.content} />
                    ))}

                </div>







                <Footer/>

            </PageBody>
        </div>
    );
}
