
var movieDataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'

var movieData

var svg = d3.select('#wrapper')

var drawTreeMap = () => {

    var tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('opacity', 0)

    var root = d3.hierarchy(movieData, item => item.children)
                .sum(item => item.value)
                .sort((item1, item2)=>item2.value - item1.value)

    var createTreeMap = d3.treemap()
                            .size([1000,600])
                            .padding(1)

    createTreeMap(root)

    var movieInfo = root.leaves()

    // to be able to append() several times and make code readable need to create a new variable
    var square = svg.selectAll('g')
                    .data(movieInfo)
                    .join('g')
                    .attr('transform', (movie)=> 'translate(' + movie.x0 + ',' + movie.y0 +')')

        square.append('rect')
                .classed('tile',true)
                .attr('fill',(movie) =>{
                    var category = movie.data.category
                    if(category == 'Action'){
                        return '#ABDEE6'
                    } else if(category == 'Drama'){
                        return '#CBAACB'
                    } else if(category == 'Adventure'){
                        return '#97C1A9'
                    } else if(category == 'Family'){
                        return '#FFFFB5'
                    } else if(category == 'Animation'){
                        return '#FFCCB6'
                    } else if(category == 'Comedy'){
                        return '#F3B0C3'
                    } else if (category == 'Biography'){
                        return '#B6CFB6'
                    }
                })
                .attr('data-name', (movie) => movie.data.name)
                .attr('data-category', (movie) =>movie.data.category)
                .attr('data-value', (movie)=>movie.data.value)
                .attr('width', (movie) => movie.x1-movie.x0)
                .attr('height', (movie) => movie.y1-movie.y0)
                .on("mouseover",(event, movie)=>{
                    // convert the data revenue numeric to string and add '$' sign for friendly display
                    let revenue = '$' + movie.data.value.toLocaleString('en').replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    tooltip.transition()
                            .style("opacity", 0.9)
                            .text(movie.data.name + ' ' + revenue)
                            .style("left", (event.pageX) + "px")
                            .style("top", (event.pageY - 28) + "px")
                            .attr('data-value',movie.data.value)
                })
                .on("mouseout", () => {
                    tooltip.transition()
                            .style('opacity', 0);
                  })

        // Add the title of movies on the rect
        square.selectAll('movieTitles')
            .data((movie)=> movie.data.name.split(/(?=[A-Z][^A-Z])/g)) // split it so it will not display the title in 1 line
            .join('text')
            .attr('x', 5)
            .attr('y',(movie, i) =>  12 + i * 10 )
            .text((movie) => movie )

//legend

    var movieCategory = ['Action','Drama','Adventure','Family','Animation','Comedy','Biography']
    var color = d3.scaleOrdinal()
                    .domain(movieCategory)
                    .range(['#ABDEE6','#CBAACB','#97C1A9','#FFFFB5','#FFCCB6','#F3B0C3','#B6CFB6'])
    legend = d3.select('#legend')

    legend.selectAll('rect')
            .data(movieCategory)
            .join('rect')
            .classed('legend-item',true)
            .attr('x', 10)
            .attr('y',(d,i) => 10 + i*(20+5))
            .attr("width", 20)
            .attr("height", 20)
            .style("fill",(d) => color(d))

    legend.selectAll("movieCategory")
            .data(movieCategory)
            .join("text")
            .attr("x", 10 + 20*1.3)
            .attr("y", (d,i) => 10 + i*(20+5) + (20/2))
            .text((d) => d)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

// legend

}

d3.json(movieDataUrl).then(
    (data,error) => {
        if(error){
            console.log(error)
        } else {
            movieData = data
            console.log(movieData)
            drawTreeMap()
        }
    }
)
