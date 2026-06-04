# Usamos una imagen de Java ligera
FROM eclipse-temurin:17-jdk-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Compila y copia el JAR (evita problemas con target stale)
COPY . /app
RUN rm -rf target || true
RUN chmod +x mvnw || true
RUN ./mvnw -q clean package -DskipTests
RUN cp target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
