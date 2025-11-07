export default function ImagePage() {
    return (
        <div className="flex h-full flex-col">
            <h1 className="text-2xl font-semibold">Image Analyzer</h1>
            <p className="text-muted-foreground">Upload an image to get insights.</p>

            {/* TODO: Image interface will go here */}
            <div className="flex-1 rounded-lg border-2 border-dashed border-muted-foreground/30 p-4 mt-4">
                <p>Image UI Placeholder</p>
            </div>
        </div>
    );
}