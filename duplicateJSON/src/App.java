import java.io.File;
import java.io.FileWriter;
import java.util.Scanner;
import java.io.IOException;
import java.io.OutputStream;

//Honestly at this point it'd be easier to use a JSON library :D. Just need to figure out how to read in a file with random object shapes
public class App {
    public static void main(String[] args) throws IOException {
        File file = new File("./files/test.json");
    if (file.exists()) {
            //myObj.length();
            Scanner scan = new Scanner(file);
            String fileContent = "";
            while(scan.hasNextLine()){
                fileContent = fileContent.concat(scan.nextLine() + "\n");
            }
            //
            
            //Remove starting and ending [], add comma after last object 
            fileContent = fileContent.replaceFirst("\\[", "");
            fileContent = fileContent.substring(0, fileContent.lastIndexOf("]") - 1) + ",";
            String writeStr = fileContent;
             
            FileWriter outputStream = new FileWriter("./files/output.json");
            outputStream.write("[");
            
            //Careful - this is Exponential growth
            for(var i = 0; i < 10; i++){
                writeStr += writeStr;
            }
            
            //Write Big String X times
            for (var x = 0; x < 1596; x++){
                System.out.println(x);
                outputStream.write(writeStr);
        }
        outputStream.write("{\"Done\":\"Done\"}]");
        outputStream.close();
            

            //Old Way
            // fileContent = fileContent.substring(0, fileContent.lastIndexOf(","));
            // fileContent = "[" + fileContent + "]";
            // OutputStream = new FileWriter("./files/output.json");
            // writer.write(fileContent);
            // writer.close();
    } else {
      System.out.println("The file does not exist.");
    }
    }
}
