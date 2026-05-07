package cl.colegio.ohiggins.asistencia.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "asistencias")
public class Asistencia {
    @Id
    private String id;
    private String alumnoId;
    private String fecha; // Formato YYYY-MM-DD
    private boolean presente;
    private String observaciones;
}