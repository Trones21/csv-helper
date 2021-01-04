import java.nio.file.*;
import java.util.stream.*;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public abstract class CsvGenerator {

    public static void generate() {

        try {

        Path dirPath = Paths.get("../files/CsvOut/");
        Files.createDirectories(dirPath);
        File out = new File(dirPath.toString() + "/generated.csv");
        FileWriter outputStream = new FileWriter(out);
        outputStream.write("Id, Name, Age \n");
    
        
        //Writing on each loop is very slow, it's better to write large strings
        //But this works for now
        int[] skipIds = {5, 8, 12, 15}; 
        for(var row = 1; row < 1000; row++){
            var id = row;
            if(!IntStream.of(skipIds).anyMatch(skipId -> skipId == id)){
            Row r = new Row();
            r.Id = row;
            r.Age = 10;
            r.Name = "Billy";
            outputStream.write(r.Id + "," + r.Name + "," + r.Age + "\r\n");
        }
        }
        outputStream.close();
    } catch(Exception e){
        System.out.println(e.getMessage());
    }
    }
}

class Row{
    public int Id;
    public String Name;
    public int Age;
}
