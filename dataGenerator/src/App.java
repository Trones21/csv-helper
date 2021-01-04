import java.io.File;

public class App {

    enum fileFormat {
        CSV, JSON
    }

    enum generateOrDuplicate {
        GENERATE, DUPLICATE
    }

    public static void main(String[] args){
         
        //Parse args
        fileFormat outFileFormat = null;
        generateOrDuplicate dataSrc = null;
        for(String arg : args){
            try{
            switch(arg.toLowerCase()){
                case "csv": outFileFormat = fileFormat.CSV; break;
                case "json": outFileFormat = fileFormat.JSON; break;
                case "g": dataSrc = generateOrDuplicate.GENERATE; break;
                case "d": dataSrc = generateOrDuplicate.DUPLICATE; break;
                default: throw new Exception("Invalid arg");
            }

        }catch(Exception e){
            System.out.println(e.getMessage());
        }

        }

        System.out.println(outFileFormat.toString());
        System.out.println(dataSrc.toString());

        if(outFileFormat == fileFormat.JSON && dataSrc == generateOrDuplicate.GENERATE){
            JsonGenerator.generate();
        }

        if(outFileFormat == fileFormat.JSON && dataSrc == generateOrDuplicate.DUPLICATE){
            var srcFilePath = "./files/test.json";
            File file = new File(srcFilePath);
            JsonDuplicator.duplicate(file);    
        }

        if(outFileFormat == fileFormat.CSV && dataSrc == generateOrDuplicate.GENERATE){
            CsvGenerator.generate();
        }

        if(outFileFormat == fileFormat.CSV && dataSrc == generateOrDuplicate.DUPLICATE){
            var srcFilePath = "./files/test.csv";
            File file = new File(srcFilePath);
            CsvDuplicator.duplicate(file);  
        }

  
}}
