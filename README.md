# Flight Search

Buscador de vuelos...

## Proceso de Negocio
### 1. Solicitar Conexión

### 2. Consultar Vuelo
* El cliente ingresa los datos del vuelo a buscar
* El cliente envia los datos al web service en formato XML con el OfficeID
* El WS recive los datos del cliente si tiene autorizacion y los datos estan completos, busca los vuelos y los retorna al cliente.
* En el cliente si el WS retorna los datos del vuelo correctos los renderiza en una nueva página.
* Despues que se encontro el vuelo, busca datos en algún Web Service de Tiempo, para obtener datos del estado del tiempo del lugar del destino en la fecha selecionada.
### 3. Consultar estado del tiempo "destino"
