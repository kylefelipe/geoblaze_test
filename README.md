# Prova de conceito: análise espacial no frontend com [geoblaze](geoblaze.io)  

Este ano pude participar do projeto de jornalismo de dados [Engolindo Fumaça](https://infoamazonia.org/project/engolindo-fumaca/), desenvolvido pelo [InfoAmazonia](https://infoamazonia.org). Foi um projeto bem desafiador que me trouxe vários aprendizados. Muitos deles já viraram artigos, como os de [cubo de dados](https://felipesbarros.github.io/pt/).

Ainda que o projeto tenha sido um sucesso (inclusive, foi um dos finalistas do [prêmio de jornalismo de dados Cláudio Weber Abramo](https://premio.jornalismodedados.org/) ) alguns desafios ficaram pendentes. Um deles está com a possibilidade de apresentar dados raster em um sistema webmap, sem dispor de grande infraestrutura de SIG, como base de dados e servidor de mapas, PostGIS e geoserver, respectivamente. Afinal, após todo o processo de análise de dados e produção das matérias, era importante apresentar os dados de forma interativa.

Aliás, desenvolvimento de soluções com dados espaciais com infraestrutura limitada tem sido um tema explorado por mim em [alguns artigos](https://felipesbarros.github.io/pt/).

Então, em resumo, a necessidade era: apresentar as imagens de satélite utilizadas nas reportagens em um mapa dinâmico, sem depender de um servidor de mapas, para que os leitores da matéria pudessem explorar os dados. Algo similar a um *dashboard*.

Pois foi ao moderar uma sessão da conferência [Free and Open Source Software for Geospatial](https://2021.foss4g.org/) (#FOSS4G) deste ano que, sem querer, me deparei com as possíveis soluções. A solução seria transportar a responsabilidade de carregar, apresentar e calcular algumas estatísticas ao *frontend*, usando o conjunto de bibliotecas [`georaster`](https://github.com/geotiff/georaster), [`georaster-layer-for-leaflet`](https://github.com/GeoTIFF/georaster-layer-for-leaflet) e [`geoblaze`](https://geoblaze.io/). A apresentação que me dispertou para essas ferramentas foi feita pelo [Daniel Dufour](https://www.linkedin.com/in/danieljdufour) sobre o [`geoblaze`](https://geoblaze.io/).

* [`georaster`](https://github.com/geotiff/georaster) é uma biblioteca JavaScript que nos permite carrregar, e até mesmo criar, dados raster a partir de objetos JavaScript;  
* [`georaster-layer-for-leaflet`](https://github.com/GeoTIFF/georaster-layer-for-leaflet) é uma biblioteca que nos permite apresentar dados `raster` (a princípio geotif) nos mapas feitos em [`leaflet`](https://leafletjs.com/);  
* [`geoblaze`](https://geoblaze.io/) é um pacote desenvolvido em JavaScript para permitir analisar dados carregados como georaster.

Dessa forma, com essa stack the bibliotecas poderemos carregar uma imagem raster georreferenciada, extrair estatísticas gerais e espaciais, bem como aplicar alguns processamentos, como algebra de bandas e apresentá-las em um webmap `leaflet`. Tudo isso sem depender de uma infraestrutura de *backend*. Tudo sendo processado no *frontend*. Sim, essa solução pode ser limitada para alguns casos. Mas nem todos. 

E, por isso, decidi explorar essa alternativa, ainda que *frontend* (e JavaScript) não seja a "minha praia". A verdade é que não consegui conter o entusiasmo e parti para uma prova conceitual. [Compartilho a prova de conceito que fiz](https://observablehq.com/@felipesbarros/proof_of_concept_geoblaze), usando o [observablehq](https://observablehq.com) (uma espécie de *jupyter-notebook* para programação *frontend*). 

Aproveitei para consolidar o resultado em uma [*landingpage*, que pode ser vista aqui](https://felipesbarros.github.io/geoblaze_test/). Nela, além de apresentar o raster, foi possível garantir que o usuário possa interagir com o mesmo. ao clicar em um pixels, O gráfico é atualizado com o comportamento temporal daquela área, apresentando, ainda o valor máximo sugerido pela Organização Mundial da Saúde.

![](./img/landingpage.png)

E, é lógico: tenho tudo documentado no [github](https://github.com/felipesbarros/geoblaze_test/).

Não posso deixar de mencionar que o [protótipo final](https://felipesbarros.github.io/geoblaze_test/) só foi possível com a ajuda do [Kyle Felipe](https://github.com/kylefelipe)

Espero que seja útil :)
