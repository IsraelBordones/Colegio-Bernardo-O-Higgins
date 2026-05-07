package cl.colegio.ohiggins.academico.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "notas")
public class Academico {
    @Id
    private String id;
    private String alumnoId; // Relación lógica con el usuario
    private String asignatura;
    private Double calificacion;
    private Integer periodo; // 1 o 2 (semestre)
}