import PageTitle from "@/app/components/pagetitle/pagetitle";
import PageBody from "@/app/components/pagebody/pagebody";
import Footer from "@/app/components/footer/footer";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { SquareArrowOutUpRight } from "lucide-react";

export default function Contact() {
    return (
        <div>
            <PageBody>
                <div className="lg:block hidden">    <PageTitle text="CONTACTEAZĂ-NE"></PageTitle></div>
              <div className="lg:hidden block">  <PageTitle text="CONTACT"></PageTitle></div>
                <div className="w-full flex text-center lg:text-right mt-8 lg:mt-24 justify-center items-center flex-col lg:flex-row">
                    <div className="lg:mr-10 lg:mb-0 mb-16">
                        <p className="text-6xl mt-5 lg:mt-0 font-bold  hidden lg:block ">CONTACT</p>
                        <a href="mailto:colegiul_zalau@yahoo.com" className="text-xl underline ">colegiul_zalau@yahoo.com</a>
                        <p className="text-xl"> (0260) 612598</p>

                        <h1 className="text-xl mt-5 font-bold">Adresa Colegiului</h1>
                        <p className="text-xl">Strada Unirii Nr. 1</p>
                        <p className="text-xl">Zalau, Salaj 450042</p>

                        <h1 className="text-xl mt-5 font-bold">Secretariat</h1>
                        <p className="text-xl">Secretar Sef - Pintea Irina</p>
                        <p className="text-xl">Program (Relatii Publice)</p>
                        <p className="text-xl">Luni - Vineri: 12:00 - 15:00</p>
                        <p className="text-xl">Marti: 16:00 - 18:00</p>

                    </div>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2711.8388174768806!2d23.0530347!3d47.1805923!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4748681f1bb8e0e1%3A0xcf294a36658b00ce!2sSilvania%20National%20College!5e0!3m2!1sen!2sro!4v1728120202242!5m2!1sen!2sro"
                        className="w-full lg:w-[50%] right-0 left-auto flex h-[500px] rounded-2xl shadow-2xl border-2"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
                <Footer/>
            </PageBody>
        </div>
    );
}
