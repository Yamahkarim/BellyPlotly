// function that builds the metadata panel
function buildMetadata(sample) {
// Use `d3.json` to fetch the metadata for a sample
// Use d3 to select the panel with id of `#sample-metadata`
// Use `.html("") to clear any existing metadata  
var url = "/metadata/" + sample; 
  var meta =d3.select("#sample-metadata");
  
  d3.json(url).then(function(response) {
    var data = response; 
    meta.html("");

// Use `Object.entries` to add each key and value pair to the panel    
// Create a loop to use d3 to append new tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) =>
      meta.append("p").text(`${key}: ${value}`));
  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  var url = "/samples/" + sample;
  //Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(response) {
    var otu_ids = response.otu_ids;
    var sample_values = response.sample_values;
    var otu_labels = response.otu_labels;

    console.log(response);
    console.log[response];
    
    //Build a Bubble Chart using the sample data
    var trace1 = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        color: otu_ids, 
        size: sample_values, 
        colorscale: "Portland"
      }
    }]; 
    var layout1 = {
        margin: { t:0},
        hovermode: "closest", 
        showlegend: true,
        xaxis: {title: 'OTU ID'}
    };
    Plotly.newPlot("bubble", trace1, layout1);

    // Build a Pie Chart
    // Slice data to grab only top 10 values
    var sliced_sample = sample_values.slice(0,10);
    var sliced_otu_ids = otu_ids.slice(0,10);
    var sliced_labels = otu_labels.slice(0,10);
    
    // add portland and earth colorscales for uniformity of charts
    var colors = ['#0A88BA', '#F2D338', '#F28F38', '#D91E1E','#0C3383','#000082','#00B4B4','#28D228','#E6E632','#784614','#440154', '#48186a','#472d7b','#424086', '#3b528b', '#33638d',];
    var viridis =['#440154', '#48186a','#472d7b','#424086', '#3b528b', '#33638d', '#2c728e', '#26828e', '#21918c', '#1fa088', '#28ae80', '#3fbc73', '#5ec962',
      '#84d44b', '#addc30', '#d8e219', '#fde725'];
    
    console.log(sliced_sample);
    
    var trace2 = [{
      values: sliced_sample,
      labels: sliced_otu_ids,
      text:sliced_labels, 
      hoverinfo: "text+value",
      textinfo: "percent",
      type: "pie",
      marker: {
        colors: colors
      } 
    }];

    Plotly.newPlot("pie",trace2);
}); 
} 

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
