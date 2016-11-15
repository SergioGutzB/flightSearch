# Buscador de vuelos

# Servicios Generales - buscador de vuelos:
## GDS_Service
### REST que expone servicios para la búsqueda y reserva de vuelos. Vuelos solo ida, ida y vuelta, nacionales e internacionales.
### GDS_Service se conecta a el API REST de Volaires.com de forma local, para obtener datos de vuelos reales generados por el GDS Amadeus. 
## Weather_Server
### WebService SOAP para la consulta del pronostico del tiempo de una diudad en una fecha específica.

# Descripción de los servicios expuestos:
## GDS_Service

HTTP verb | Action | Response status code
----------|--------|---------------------
GET|Request an existing resource|"200 OK" if the resource exists, "404 Not Found" if it does not exist, and "500 Internal Server Error" for other errors|
PUT|Create or update a resource| "201 CREATED" if a new resource is created, "200 OK" if updated, and "500 Internal Server Error" for other errors
POST|Update an existing resource|"200 OK" if the resource has been updated successfully, "404 Not Found" if the resource to be updated does not exist, and "500 Internal Server Error" for other errors
DELETE|Delete a resource|"200 OK" if the resource has been deleted successfully, "404 Not Found" if the resource to be deleted does not exist, and "500 Internal Server Error" for other errors

### GDS_Service WADL     

```<application 
	xmlns="http://wadl.dev.java.net/2009/02" 
	xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
	xmlns:hy="http://www.herongyang.com/Service">
	<doc xml:lang="en" />
	<resources base="http://127.0.0.1:3000/">
		<resource path="/api/search">
			<method name="GET">
				<request>
					<param name="origin" type="xsd:string" style="query"/>
					<param name="destination" type="xsd:string" style="query"/>
					<param name="departure_date" type="xsd:string" style="query"/>
					<param name="return_date" type="xsd:string" style="query"/>
					<param name="adults" type="xsd:string" style="query"/>
					<param name="children" type="xsd:string" style="query"/>
					<param name="babies1" type="xsd:string" style="query"/>
				</request>
				<response status="200">
					<representation mediaType="application/json" />
				</response>
				<response status="404">
					<representation mediaType="text/html" />
				</response>
				<response status="500">
					<representation mediaType="text/html" />
				</response>
			</method>
		</resource>
		<resource path="/api/reserva">
			<method name="GET">
				<request/>
				<response status="200">
					<representation mediaType="application/json" />
				</response>
				<response status="404">
					<representation mediaType="text/html" />
				</response>
				<response status="500">
					<representation mediaType="text/html" />
				</response>
			</method>
			<method name="POST">
				<request/>
				<response status="200">
					<representation mediaType="application/json" />
				</response>
				<response status="404">
					<representation mediaType="text/html" />
				</response>
				<response status="500">
					<representation mediaType="text/html" />
				</response>
			</method>			
		</resource>
		<resource path="/api/reserva/{reserva_id}">			
			<method name="PUT">
				<request/>
				<response status="200">
					<representation mediaType="application/json" />
				</response>
				<response status="404">
					<representation mediaType="text/html" />
				</response>
				<response status="500">
					<representation mediaType="text/html" />
				</response>
			</method>
			<method name="DELETE">
				<request/>
				<response status="200">
					<representation mediaType="application/json" />
				</response>
				<response status="404">
					<representation mediaType="text/html" />
				</response>
				<response status="500">
					<representation mediaType="text/html" />
				</response>
			</method>
		</resource>
	</resources>
</application>```