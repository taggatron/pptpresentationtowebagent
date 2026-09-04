#import <Foundation/Foundation.h>
#import <PDFKit/PDFKit.h>
#import <AppKit/AppKit.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        if (argc < 3) {
            printf("Usage: pdf2png <input.pdf> <output_dir> [scale]\n");
            return 1;
        }
        NSString *pdfPath = [NSString stringWithUTF8String:argv[1]];
        NSString *outDir = [NSString stringWithUTF8String:argv[2]];
        double scale = argc > 3 ? atof(argv[3]) : 2.0; // default 2x high-res
        if (scale < 0.5) scale = 2.0;

        NSURL *url = [NSURL fileURLWithPath:pdfPath];
        PDFDocument *doc = [[PDFDocument alloc] initWithURL:url];
        if (!doc) {
            fprintf(stderr, "Failed to open PDF at %s\n", [pdfPath UTF8String]);
            return 1;
        }

        NSFileManager *fm = [NSFileManager defaultManager];
        NSError *err = nil;
        [fm createDirectoryAtPath:outDir withIntermediateDirectories:YES attributes:nil error:&err];
        if (err) {
            fprintf(stderr, "Failed to create directory: %s\n", [[err localizedDescription] UTF8String]);
            return 1;
        }

        NSInteger count = [doc pageCount];
        printf("Exporting %ld slide pages at %.1fx scale...\n", (long)count, scale);

        for (NSInteger i = 0; i < count; i++) {
            PDFPage *page = [doc pageAtIndex:i];
            NSRect bounds = [page boundsForBox:kPDFDisplayBoxMediaBox];
            NSSize targetSize = NSMakeSize(bounds.size.width * scale, bounds.size.height * scale);

            NSImage *img = [[NSImage alloc] initWithSize:targetSize];
            [img lockFocus];
            CGContextRef ctx = [[NSGraphicsContext currentContext] CGContext];
            CGContextSetRGBFillColor(ctx, 1.0, 1.0, 1.0, 1.0);
            CGContextFillRect(ctx, CGRectMake(0, 0, targetSize.width, targetSize.height));
            CGContextScaleCTM(ctx, scale, scale);
            [page drawWithBox:kPDFDisplayBoxMediaBox toContext:ctx];
            [img unlockFocus];

            NSBitmapImageRep *rep = [NSBitmapImageRep imageRepWithData:[img TIFFRepresentation]];
            NSData *pngData = [rep representationUsingType:NSBitmapImageFileTypePNG properties:@{}];
            NSString *outName = [NSString stringWithFormat:@"slide_%02ld.png", (long)(i + 1)];
            NSString *outPath = [outDir stringByAppendingPathComponent:outName];
            [pngData writeToFile:outPath atomically:YES];
        }
        printf("Successfully exported %ld slide pages to %s\n", (long)count, [outDir UTF8String]);
    }
    return 0;
}
