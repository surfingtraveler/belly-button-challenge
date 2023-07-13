const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the data from the JSON file using d3.json()
d3.json(url).then(function(data) {
  console.log(data);
  console.log(data.metadata);
  console.log(data.samples);

  // Get the necessary arrays from the data object
  let sampleValues = data.samples[0].sample_values.slice(0, 10).reverse();
  let otuIds = data.samples[0].otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
  let otuLabels = data.samples[0].otu_labels.slice(0, 10).reverse();

  // Create the horizontal bar chart
  let trace = {
    x: sampleValues,
    y: otuIds,
    text: otuLabels,
    type: "bar",
    orientation: "h"
  };

  let plotData = [trace];

  let layout = {
    title: "Top 10 OTUs",
  };

  Plotly.newPlot("bar", plotData, layout);

  // Create the dropdown menu
  let dropdown = d3.select("#selDataset");
  dropdown.selectAll("option")
    .data(data.samples)
    .enter()
    .append("option")
    .attr("value", function(d, i) { return i; })
    .text(function(d, i) { return d.id; })
    .property("selected", function(d, i) { return i === 0; })
    .on("change", updateChart);

  function updateChart() {
    let selectedIndex = dropdown.property("value");
    let selectedSampleValues = data.samples[selectedIndex].sample_values.slice(0, 10).reverse();
    let selectedOtuIds = data.samples[selectedIndex].otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
    let selectedOtuLabels = data.samples[selectedIndex].otu_labels.slice(0, 10).reverse();

    let updateTrace = {
      x: [selectedSampleValues],
      y: [selectedOtuIds],
      text: [selectedOtuLabels]
    };

    Plotly.update("bar", updateTrace);

    // Update the sample metadata
    updateMetadata(data.metadata[selectedIndex]);
  }

  // Create the trace for the bubble chart
  let bubbleTrace = {
    x: otuIds,
    y: sampleValues,
    text: otuLabels,
    mode: "markers",
    marker: {
      size: sampleValues,
      color: otuIds,
      colorscale: "Portland"
    }
  };

  let bubbleData = [bubbleTrace];

  let bubbleLayout = {
    title: "Bubble Chart",
    xaxis: { title: 'OTU IDs' },
  };

  Plotly.newPlot("bubble", bubbleData, bubbleLayout);

  // Update the Panel info
  updateMetadata(data.metadata[0]);
})
.catch(function(error) {
  console.log(error);
});

// Update the sample metadata
function updateMetadata(metadata) {
  // Select the element to display the metadata
  let metadataContainer = d3.select("#sample-metadata");

  // Clear existing metadata
  metadataContainer.html("");

  // Iterate over the metadata object and append key-value pairs
  Object.entries(metadata).forEach(([key, value]) => {
    metadataContainer.append("p").text(`${key}: ${value}`);
  });
}

// Function to handle the dropdown change event
function optionChanged(value) {
  // Call the updateChart() function to update the chart and metadata
  updateChart(value);
}

// Function to update the chart and metadata based on the selected index
function updateChart(selectedIndex) {
  d3.json(url).then(function(data) {
    let selectedSampleValues = data.samples[selectedIndex].sample_values.slice(0, 10).reverse();
    let selectedOtuIds = data.samples[selectedIndex].otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
    let selectedOtuLabels = data.samples[selectedIndex].otu_labels.slice(0, 10).reverse();

    let updateTrace = {
      x: [selectedSampleValues],
      y: [selectedOtuIds],
      text: [selectedOtuLabels]
    };

    Plotly.update("bar", updateTrace);

    // Update the sample metadata
    updateMetadata(data.metadata[selectedIndex]);
  });
}
