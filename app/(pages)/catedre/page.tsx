/* eslint-disable @next/next/no-img-element */
import PageBody from "@/app/components/pagebody/pagebody";
import PageTitle from "@/app/components/pagetitle/pagetitle";
import Footer from "@/app/components/footer/footer";


export default function Catedre() {


    return (
        <div>
            <PageBody>
                <PageTitle text="CATEDRE"/>
                <div className="mt-16 lg:mt-24">
                    <h1 className="lg:hidden block text-center text-2xl font-bold">INFORMATICĂ</h1>
                    <div className="w-full relative aspect-[1400/500]">
                        <img src="/assets/photos/catedra-de-info.png" alt="catedra" className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl border-2 shadow-2xl" />
                        <div className="absolute inset-x-0 justify-center lg:items-end items-start bottom-0 lg:pb-4 pt-2 hidden lg:flex">
                        <span className="bg-white lg:text-5xl text-xl font-bold lg:p-4 p-2 rounded-xl border-2 shadow-2xl">
                            INFORMATICĂ
                        </span>
                        </div>
                    </div>
                </div>
                <div className="lg:mt-16 mt-8">
                    <h1 className="lg:hidden block text-center text-2xl font-bold">MATEMATICĂ</h1>
                    <div className="w-full relative  aspect-[1400/500]">
                        <img src="/assets/photos/catedra-de-mate.png" alt="catedra" className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl border-2 shadow-2xl" />
                        <div className="absolute inset-x-0 justify-center lg:items-end items-start bottom-0 lg:pb-4 pt-2 hidden lg:flex">
                        <span className="bg-white lg:text-5xl text-xl font-bold lg:p-4 p-2 rounded-xl border-2 shadow-2xl">
                            MATEMATICĂ
                        </span>
                        </div>
                    </div>
                </div>
                <div className="lg:mt-16 mt-8">
                    <h1 className="lg:hidden block text-center text-2xl font-bold">LIMBA ROMANĂ</h1>
                    <div className="w-full relative  aspect-[1400/500]">
                        <img src="/assets/photos/catedra-de-limbi.png" alt="catedra" className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl border-2 shadow-2xl" />
                        <div className="absolute inset-x-0 justify-center lg:items-end items-start bottom-0 lg:pb-4 pt-2 hidden lg:flex">
                        <span className="bg-white lg:text-5xl text-xl font-bold lg:p-4 p-2 rounded-xl border-2 shadow-2xl">
                            LIMBA ROMANĂ
                        </span>
                        </div>
                    </div>
                </div>
                <div className="lg:mt-16 mt-8">
                    <h1 className="lg:hidden block text-center text-2xl font-bold">ȘTIINȚE</h1>
                    <div className="w-full relative  aspect-[1400/500]">
                        <img src="/assets/photos/catedra-de-stiinte.png" alt="catedra" className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl border-2 shadow-2xl" />
                        <div className="absolute inset-x-0 justify-center lg:items-end items-start bottom-0 lg:pb-4 pt-2 hidden lg:flex">
                        <span className="bg-white lg:text-5xl text-xl font-bold lg:p-4 p-2 rounded-xl border-2 shadow-2xl">
                            ȘTIINȚE
                        </span>
                        </div>
                    </div>
                </div>
                <div className="lg:mt-16 mt-8">
                    <h1 className="lg:hidden block text-center text-2xl font-bold">LIMBI MODERNE</h1>
                    <div className="w-full relative  aspect-[1400/500]">
                        <img src="/assets/photos/catedra-de-limbi-moderne.png" alt="catedra" className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl border-2 shadow-2xl" />
                        <div className="absolute inset-x-0 justify-center lg:items-end items-start bottom-0 lg:pb-4 pt-2 hidden lg:flex">
                        <span className="bg-white lg:text-5xl text-xl font-bold lg:p-4 p-2 rounded-xl border-2 shadow-2xl">
                            LIMBI MODERNE
                        </span>
                        </div>
                    </div>
                </div>
                <div className="lg:mt-16 mt-8">
                    <h1 className="lg:hidden block text-center text-2xl font-bold">ISTORIE SOCIO ARTE SPORT</h1>
                    <div className="w-full relative  aspect-[1400/500]">
                        <img src="/assets/photos/catedra-de-isto-socio-arte-sport%20(1).png" alt="catedra" className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl border-2 shadow-2xl" />
                        <div className="absolute inset-x-0 justify-center lg:items-end items-start bottom-0 lg:pb-4 pt-2 hidden lg:flex">
                        <span className="bg-white lg:text-5xl text-xl font-bold lg:p-4 p-2 rounded-xl border-2 shadow-2xl">
                            ISTORIE SOCIO ARTE SPORT
                        </span>
                        </div>
                    </div>
                </div>
                <div className="lg:mt-16 mt-8">
                    <h1 className="lg:hidden block text-center text-2xl font-bold">PERSONAL AUXILIAR</h1>
                    <div className="w-full relative  aspect-[1400/500]">
                        <img src="/assets/photos/personal-auxiliar%20(1).png" alt="catedra" className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl border-2 shadow-2xl" />
                        <div className="absolute inset-x-0 justify-center lg:items-end items-start bottom-0 lg:pb-4 pt-2 hidden lg:flex">
                        <span className="bg-white lg:text-5xl text-xl font-bold lg:p-4 p-2 rounded-xl border-2 shadow-2xl">
                            PERSONAL AUXILIAR
                        </span>
                        </div>
                    </div>
                </div>








                <Footer/>

            </PageBody>
        </div>
    );
}
