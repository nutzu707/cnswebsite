/* eslint-disable @next/next/no-img-element */
import PageTitle from "@/app/components/pagetitle/pagetitle";
import PageBody from "@/app/components/pagebody/pagebody";
import Footer from "@/app/components/footer/footer";
import fs from 'fs';
import path from 'path';
export default async function Conducere() {

    const directoryPath = path.join(process.cwd(), 'public','uploads', 'conducere');
    const files = fs.readdirSync(directoryPath);

    const people = files
        .filter(file => file.endsWith('.json'))
        .map(file => {
            const filePath = path.join(directoryPath, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const parsedData = JSON.parse(fileContent);
            return parsedData.person;
        });

    // Sort by order (fallback to large number) then name
    people.sort((a, b) => {
        const ao = a.order ?? Number.MAX_SAFE_INTEGER;
        const bo = b.order ?? Number.MAX_SAFE_INTEGER;
        if (ao !== bo) return ao - bo;
        return a.name.localeCompare(b.name);
    });

    return (
        <div>
            <PageBody>
                <PageTitle text="CONDUCERE"></PageTitle>
                <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2 place-items-center">
                    {people.map((person, index) => (
                        <div key={index} className="text-center mt-16 lg:mt-24">
                            <img
                                className="w-[300px] rounded-full border-2 h-[300px] object-cover shadow-2xl"
                                src={person.photo}
                                alt={person.name}
                            />
                            <p className="font-bold text-3xl mt-4 uppercase">{person.name}</p>
                            <p className="font-bold text-xl text-indigo-900 uppercase">{person.position}</p>
                        </div>
                    ))}
                </div>
                <Footer />
            </PageBody>
        </div>
    );
}
