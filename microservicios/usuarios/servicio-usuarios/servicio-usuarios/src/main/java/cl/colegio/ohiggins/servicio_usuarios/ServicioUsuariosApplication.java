package cl.colegio.ohiggins.servicio_usuarios;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;

// Excluimos las clases de Mongo para que el backend corra sin necesidad de la base de datos instalada
@SpringBootApplication(exclude = {
    MongoAutoConfiguration.class, 
    MongoDataAutoConfiguration.class
})
public class ServicioUsuariosApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServicioUsuariosApplication.class, args);
    }

}