import java.io.File;
import java.io.FileWriter;
import java.util.Scanner;

public abstract class JsonDuplicator {

    public static void duplicate(File srcFile) {
        try {
            if (srcFile.exists()) {
                Scanner scan = new Scanner(srcFile);
                String fileContent = "";
                while (scan.hasNextLine()) {
                    fileContent = fileContent.concat(scan.nextLine() + "\n");
                }

                // Remove starting and ending [], add comma after last object
                fileContent = fileContent.replaceFirst("\\[", "");
                fileContent = fileContent.substring(0, fileContent.lastIndexOf("]") - 1) + ",";
                String writeStr = fileContent;

                FileWriter outputStream = new FileWriter("./files/output.json");
                outputStream.write("[");

                // Careful - this is Exponential growth
                for (var i = 0; i < 5; i++) {
                    writeStr += writeStr;
                }

                // Write Big String X times
                for (var x = 0; x < 1; x++) {
                    System.out.println(x);
                    outputStream.write(writeStr);
                }
                outputStream.close();

            } else {
                System.out.println("The file does not exist.");
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
