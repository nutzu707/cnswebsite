import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import PageBody from "@/app/components/pagebody/pagebody";
import PageTitle from "@/app/components/pagetitle/pagetitle";
import DocumentsListBlob from "@/app/components/displaydocumentsblob/displaydocumentsblob";
import BlobStorageIndicator from "@/app/components/blobstorageindicator/blobstorageindicator";
import PersonManager from "@/app/components/personmanager/personmanager";
import DirigintiManager from "@/app/components/dirigintimanager/dirigintimanager";
import ConsiliuProfesoralManager from "@/app/components/consiliuprofesoralmanager/consiliuprofesoralmanager";
import CatedreManager from "@/app/components/catedremanager/catedremanager";
import CreateProjectJsonFile from "@/app/components/createproject/createproject";
import React from "react";
import RefreshButton from "@/app/components/refreshbutton/refreshbutton";
import CreateNews from "@/app/components/createnewsarticle/createnewsarticle";
import NewsListDashboard from "@/app/components/newslistdashboard/newslistdashboard";
import ProjectsListDashboard from "@/app/components/projectslistdashboard/projectslistdashboard";
import Navbardashboard from "@/app/components/navbardashboard/navbardashboard";
import ModifyNavbarLinks from "@/app/components/modifynavbarlinks/modifynavbarlinks";
import LogoutButton from "@/app/components/logoutbutton/logoutbutton";

export default async function Dashboard() {
    const authenticated = await isAuthenticated();
    
    if (!authenticated) {
        redirect("/auth/signin");
    }

    return (
        <div>

            <PageBody>
                <PageTitle text="DASHBOARD"></PageTitle>
                
                <BlobStorageIndicator />

                <div className="h-20 hidden bg-white lg:flex fixed bottom-0 self-center z-50">
                    <div className="flex h-16 rounded-xl border-2 shadow-2xl justify-center items-center px-3">
                        <Navbardashboard/>
                        <LogoutButton />
                    </div>
                </div>

                <div className="lg:w-[1000px] w-full self-center mt-32 shadow-2xl p-10 rounded-2xl border-2 text-2xl font-bold" id="management">
                    <p className="lg:text-5xl text-3xl font-bold text-indigo-900 mb-4">DOCUMENTE MANAGEMENT</p>
                    <DocumentsListBlob folder="documents/documente-management" />
                </div>
                <div className="lg:w-[1000px] w-full self-center mt-16 shadow-2xl p-10 rounded-2xl border-2 text-2xl font-bold" id="elevi">
                    <p className="lg:text-5xl text-3xl font-bold text-indigo-900 mb-4">DOCUMENTE ELEVI</p>
                    <DocumentsListBlob folder="documents/documente-elevi" />
                </div>
                <div className="lg:w-[1000px] w-full self-center mt-16 shadow-2xl p-10 rounded-2xl border-2 text-2xl font-bold" id="profesori">
                    <p className="lg:text-5xl text-3xl font-bold text-indigo-900 mb-4">DOCUMENTE PROFESORI</p>
                    <DocumentsListBlob folder="documents/documente-profesori" />
                </div>


                <div className="lg:w-[1000px] w-full self-center mt-16 shadow-2xl p-10 rounded-2xl border-2 text-2xl font-bold" id="cjex">
                    <p className="lg:text-5xl text-3xl font-bold text-indigo-900 mb-4">CJEX SALAJ</p>
                    <DocumentsListBlob folder="documents/cjex-salaj" />
                </div>

                <div className="lg:w-[1000px] w-full self-center mt-16 shadow-2xl p-10 rounded-2xl border-2 text-2xl font-bold" id="premii">
                    <p className="lg:text-5xl text-3xl font-bold text-indigo-900 mb-4">PREMII</p>
                    <DocumentsListBlob folder="documents/premii" />
                </div>

                <div className="lg:w-[1000px] w-full self-center mt-16 shadow-2xl p-10 rounded-2xl border-2 text-2xl font-bold" id="anunturi">
                    <p className="lg:text-5xl text-3xl font-bold text-indigo-900 mb-4">ANUNTURI</p>
                    <CreateNews/>
                    <div className="mt-8">
                        <NewsListDashboard />
                    </div>
                </div>

                <div className="lg:w-[1000px] w-full self-center mt-16 shadow-2xl p-10 rounded-2xl border-2 text-2xl font-bold" id="proiecte">
                    <p className="lg:text-5xl text-3xl font-bold text-indigo-900 mb-4">PROIECTE</p>
                    <CreateProjectJsonFile/>
                    <div className="mt-8">
                        <ProjectsListDashboard />
                    </div>
                </div>

                <div className="lg:w-[1000px] w-full self-center mt-16 shadow-2xl p-10 rounded-2xl border-2 text-2xl font-bold" id="conducere">
                    <p className="lg:text-5xl text-3xl font-bold text-indigo-900 mb-4">CONDUCERE</p>
                    <PersonManager folder="conducere" title="Conducere" apiEndpoint="/api/conducere" />
                </div>


                <div className="lg:w-[1000px] w-full self-center mt-16 shadow-2xl p-10 rounded-2xl border-2 text-2xl font-bold" id="consiliu">
                    <p className="lg:text-5xl text-3xl font-bold text-indigo-900 mb-4">CONSILIU DE ADMINISTRATIE</p>
                    <PersonManager folder="consiliu-de-administratie" title="Consiliu de Administratie" apiEndpoint="/api/consiliu-de-administratie" />
                </div>

                <div className="lg:w-[1000px] w-full self-center mt-16 shadow-2xl p-10 rounded-2xl border-2 text-2xl font-bold" id="diriginti">
                    <p className="lg:text-5xl text-3xl font-bold text-indigo-900 mb-4">DIRIGINTI</p>
                    <DirigintiManager />
                </div>

                <div className="lg:w-[1000px] w-full self-center mt-16 shadow-2xl p-10 rounded-2xl border-2 text-2xl font-bold" id="consiliu-profesoral">
                    <p className="lg:text-5xl text-3xl font-bold text-indigo-900 mb-4">CONSILIU PROFESORAL</p>
                    <ConsiliuProfesoralManager />
                </div>

                <div className="lg:w-[1000px] w-full self-center mt-16 shadow-2xl p-10 rounded-2xl border-2 text-2xl font-bold" id="catedre">
                    <p className="lg:text-5xl text-3xl font-bold text-indigo-900 mb-4">CATEDRE PHOTOS</p>
                    <CatedreManager />
                </div>

                <div className="lg:w-[1000px] w-full self-center mt-16 shadow-2xl p-10 rounded-2xl border-2 text-2xl font-bold" id="navbar-links">
                    <p className="lg:text-5xl text-3xl font-bold text-indigo-900 mb-4">ORAR (NAVBAR)</p>
                    <ModifyNavbarLinks/>
                    <div className="w-full flex justify-end mb-8 mt-8">
                        <RefreshButton/>
                    </div>
                </div>

                <div className="mt-32"></div>


            </PageBody>
        </div>
    );
}
