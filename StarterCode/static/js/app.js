function buildMetadata(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      let metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      let results_array = metadata.filter(sampleNumber => sampleNumber.id == sample);

      let result = results_array[0];
      
      // Use d3 to select the panel with id of `#sample-metadata`
      let panel = d3.select('#sample-metadata')
  
      // Use `.html("") to clear any existing metadata
      panel.html('')
  
      // append new tags for each key-value
      for (i in result) {
        panel.append('h6').text(`${i}: ${result[i]}`);
      }
    }
  )};
  
  // chart building
  function buildCharts(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      let samples = data.samples;
      let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];

      //needed for bubble chart
      let otuIds = result.otu_ids;
      let otuLabels = result.otu_labels;
      let sampleValues = result.sample_values;

      // needed for Gauge chart for wash frequency
      let metadata = data.metadata;
      let resultsArrayMeta = metadata.filter(sampleNumber => sampleNumber.id == sample);
      let resultMeta = resultsArrayMeta[0];

      

      let barData = {
        //key value pairs..samples filter to one of the ids which have the 0 index which we can then grab the .otu ids (cause again dictionary)
          x: sampleValues.slice(0,10).reverse(),
          y: otuIds.slice(0,10).map(otu => `OTU ${otu}`).reverse(),
          text: otuLabels.slice(0,10).reverse(),
          type: 'bar',
          orientation: 'h'
        };
        
        Plotly.newPlot("bar", [barData],{responsive:true});

      // BONUS: Build the Gauge Chart

      console.log(resultMeta.wfreq);

      let gauge_chart = {
        type: 'indicator',
        mode: 'gauge+number',
        value: resultMeta.wfreq,
        gauge: {
          axis:{range: [0, 9] },
          steps: [
            { range: [0, 1], 
              color: '#e9f0dd'},
            { range: [1, 2], 
              color: '#dff2bd'},
            { range: [2, 3], 
              color: '#d2eda1'},
            { range: [3, 4], 
              color: '#c5eb81'},
            { range: [4, 5], 
              color: '#b4e856'},
            { range: [5, 6], 
              color: '#8ebf34'},
            { range: [6, 7], 
              color: '#6c9918'},
            { range: [7, 8], 
              color: '#547a0b'},
            { range: [8, 9], 
              color: '#365202'}
            
          ],
          threshold: {
            line: {color: 'red', width: 4},
            thickness: 0.75,
            value: resultMeta.wfreq
          }
        }
      };
      
      let gaugeLayout = {
        width: 600,
        height: 400,
        title: 'Belly Button Washing Frequency per Week'

      };

      Plotly.newPlot('gauge', [gauge_chart], gaugeLayout)
  
      // Build a Bubble Chart
      let bubbleData = {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: "Earth"
        }
      };
      
      let bubbleLayout = {
        height: 500,
        width: 1000,
        xaxis: {title: {
          text: 'OTU ID'
          }
        }
      };
  
      Plotly.newPlot("bubble", [bubbleData], bubbleLayout,{responsive:true});
      
  });
}

  function init() {
    // Grab a reference to the dropdown select element
    let dropdown = d3.select('#selDataset');
    // Use the list of sample names to populate the select options
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      let sampleNames = data.names;
      
      for (let i = 0; i < sampleNames.length; i++) {
        //append the option tag's value (hence property) to whatever samplename we're currently on .text which number it is
        dropdown.append('option').property('value', sampleNames[i]).text(sampleNames[i]);
      };
    buildMetadata(sampleNames[0]);
    buildCharts(sampleNames[0]);
    })
  };

  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
  };
  
  // Initialize the dashboard
  init();