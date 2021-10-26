# Prova de conceito: analise espacial no frontend com [geoblaze](geoblaze.io)  

Este ano pude participar do projeto de jornalismo de dados [Engolindo Fumaça](https://infoamazonia.org/project/engolindo-fumaca/), desenvolvido pelo [InfoAmazonia](https://infoamazonia.org). Foi um projeto bem desafiador que me trouxe vários aprendizados. Muitos deles já viraram artigos, como os de [cubo de dados](https://felipesbarros.github.io/pt/).

Ainda que o projeto tenha sido um sucesso (inclusive, foi um dos finalistas do [prêmio de jornalismo de dados Cláudio Weber Abramo](https://premio.jornalismodedados.org/) ) alguns desafios ficaram pendentes. Um deles está com a possibilidade de apresentar dados raster em um sistema webmap, sem dispor de grande infraestrutura de SIG, como base de dados e servidor de mapas, PostGIS e geoserver, respectivamente. Afinal, após todo o processo de análise de dados e produção das matérias, era importante apresentar os dados de forma interativa.

Aliás, desenvolvimento de soluções com dados espaciais com infraestrutura limitada tem sido um tema explorado por mim em [alguns artigos](https://felipesbarros.github.io/pt/).

Então, em resumo, a necessidade era: apresentar as imagesn de satelite utilizadas nas reportagens em um mapa dinâmico, sem depender de um servidor de mapas.

Pois foi ao moderar uma sessão da conferência [Free and Open Source Software for Geospatial](https://2021.foss4g.org/) (#FOSS4G) deste ano, que, sem querer me deparei com as possíveis soluções. A solução se chama [Geoblaze](https://geoblaze.io/) e foi apresentada pelo [Daniel Dufour](https://www.linkedin.com/in/danieljdufour). 

O geoblaze é um pacote desenvolvido em JavaScript para análise de dados raster. Junto com o [`georaster`](https://github.com/geotiff/georaster) nos permite, usando frontend, carregar uma imagem raster georreferenciada, extrair estatísticas gerais e espaciais, bem como aplicar alguns processamentos, como algebra de bandas.

> GeoBlaze is a blazing fast raster analysis engine written in pure JavaScript.

Ainda que frontend (e JavaScript) não seja a "minha praia", não consegui conter o entusiasmo e parti para uma prova conceitual. 

[Compartilho a prova de conceito que fiz](https://observablehq.com/@felipesbarros/proof_of_concept_geoblaze), usando o [observablehq](https://observablehq.com) (uma espécie de jupyter-notebook para programação frontend). 

Espero que seja útil :)