import fs from 'fs';
import path from 'path';
import PageTitle from "@/app/components/pagetitle/pagetitle";
import PageBody from "@/app/components/pagebody/pagebody";
import Footer from "@/app/components/footer/footer";

function shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function getImages() {
    const imagesFolderPath = path.join(process.cwd(), 'public/uploads/arhiva-foto');
    const files = await fs.promises.readdir(imagesFolderPath);

    const imageFiles = files.filter((file) =>
        /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file)
    );

    return imageFiles;
}

export default async function ArhivaPage() {

    const images = await getImages();

    const shuffledImages = shuffleArray(images);

    return (
        <div>
            <PageBody>
                <PageTitle text="ARHIVA FOTO"></PageTitle>
                <div className="mt-16 lg:mt-24 justify-center " style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {shuffledImages.map((image, index) => (
                        <div key={index} style={{ margin: 10 }}>
                            <a
                                href={`/assets/arhiva-foto/${image}`}  // Link to the image file
                                target="_blank"                 // Open in new tab
                                rel="noopener noreferrer"       // Security best practice
                            >
                                <img
                                    src={`/assets/arhiva-foto/${image}`}
                                    alt={`image-${index}`}
                                    className="lg:w-[300px] md:w-[300px] w-full shadow-2xl rounded-xl border-2"
                                />
                            </a>
                        </div>
                    ))}
                </div>
                <Footer />
            </PageBody>
        </div>
    );
}
