let providerCost = 1;

const drilldown = async function (e) {
    if (!e.seriesOptions) {
        const chart = this,
            mapKey = `countries/us/${e.point.drilldown}-all`;

        // Handle error, the timeout is cleared on success
        let fail = setTimeout(() => {
            if (!Highcharts.maps[mapKey]) {
                chart.showLoading(`
                    <i class="icon-frown"></i>
                    Failed loading ${e.point.name}
                `);
                fail = setTimeout(() => {
                    chart.hideLoading();
                }, 1000);
            }
        }, 3000);

        // Show the Font Awesome spinner
        chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>');

        // Load the drilldown map
        const topology = await fetch(
            `https://code.highcharts.com/mapdata/${mapKey}.topo.json`
        ).then(response => response.json());

        const data = Highcharts.geojson(topology);
        console.log(data)

        // Set a non-random bogus value
        data.forEach((d, i) => {
            d.value = i;
        });

        // Apply the recommended map view if any
        chart.mapView.update(
            Highcharts.merge(
                {
                    insets: undefined,
                    padding: 0
                },
                topology.objects.default['hc-recommended-mapview']
            )
        );

        // Hide loading and add series
        chart.hideLoading();
        addSquares();
        clearTimeout(fail);
        document.getElementById("provider-count").innerHTML = data.length*2;
        chart.addSeriesAsDrilldown(e.point, {
            name: e.point.name,
            data,
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return '•'; // This will display a dot instead of the full name
                },
                style: {
                    fontSize: '14px', // Adjust size if needed
                    color: '#000'     // Change color as needed
                }
            }
        });
    }
};

// On drill up, reset to the top-level map view
const afterDrillUp = function (e) {
    removeSquares();
    if (e.seriesOptions.custom && e.seriesOptions.custom.mapView) {
        e.target.mapView.update(
            Highcharts.merge(
                { insets: undefined },
                e.seriesOptions.custom.mapView
            ),
            false
        );
    }
};

(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
    ).then(response => response.json());

    const data = Highcharts.geojson(topology);

    const mapView = topology.objects.default['hc-recommended-mapview'];

    // Set drilldown pointers
    data.forEach((d, i) => {
        d.drilldown = d.properties['hc-key'];
        d.value = i; // Non-random bogus data
    });

    // Instantiate the map
    Highcharts.mapChart('container', {
        chart: {
            events: {
                drilldown,
                afterDrillUp
            }
        },

        title: {
            text: ''
        },

        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            title: {
                text: 'Provider Gap in the network', // This adds a title or description to the legend
                style: {
                    fontWeight: 'bold'
                }
            }
        },
    

        colorAxis: {
            min: 0,
            minColor: '#D0E3F4',
            maxColor: '#234286'
        },

        mapView,

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        plotOptions: {
            map: {
                states: {
                    hover: {
                        color: '#EEDD66'
                    }
                }
            }
        },

        series: [{
            data,
            name: 'USA',
            dataLabels: {
                enabled: true,
                format: '{point.properties.postal-code}'
            },
            custom: {
                mapView
            }
        }],

        drilldown: {
            activeDataLabelStyle: {
                color: '#FFFFFF',
                textDecoration: 'none',
                textOutline: '1px #000000'
            },
            breadcrumbs: {
                floating: true
            },
            drillUpButton: {
                relativeTo: 'spacingBox',
                position: {
                    x: 0,
                    y: 60
                }
            }
        }
    });

})();

function removeSquares(){
    var squares = document.querySelectorAll(".square");
    squares.forEach(function(square){
        if(square){
            square.remove();
        }
    });
}
// JavaScript code

// Initialize variables
let selectedSquare = null; // Variable to store the clicked square
let comparisonProviders = []; // Array to store providers to compare

// Provider data array with expanded fields
const providers = [
    {
        id: 'provider_0',
        negotiatedPrice: '$200',
        completesNetwork: 'Yes',
        participatingNetworks: 'HealthPlan A, HealthPlan B',
        appointmentWaitTimes: '3 days',
        reachable: 'Yes',
        positiveFeedback: '85%',
        nursingHomeQuality: '4 stars'
    },
    {
        id: 'provider_1',
        negotiatedPrice: '$250',
        completesNetwork: 'No',
        participatingNetworks: 'HealthPlan A',
        appointmentWaitTimes: '5 days',
        reachable: 'No',
        positiveFeedback: '78%',
        nursingHomeQuality: '3 stars'
    },
    {
        id: 'provider_2',
        negotiatedPrice: '$220',
        completesNetwork: 'Yes',
        participatingNetworks: 'HealthPlan B, HealthPlan C',
        appointmentWaitTimes: '2 days',
        reachable: 'Yes',
        positiveFeedback: '90%',
        nursingHomeQuality: '5 stars'
    },
    {
        id: 'provider_3',
        negotiatedPrice: '$180',
        completesNetwork: 'No',
        participatingNetworks: 'HealthPlan A, HealthPlan C',
        appointmentWaitTimes: '4 days',
        reachable: 'Yes',
        positiveFeedback: '82%',
        nursingHomeQuality: '4 stars'
    },
    {
        id: 'provider_4',
        negotiatedPrice: '$210',
        completesNetwork: 'Yes',
        participatingNetworks: 'HealthPlan B',
        appointmentWaitTimes: '3 days',
        reachable: 'No',
        positiveFeedback: '88%',
        nursingHomeQuality: '3 stars'
    },
    {
        id: 'provider_5',
        negotiatedPrice: '$230',
        completesNetwork: 'No',
        participatingNetworks: 'HealthPlan A, HealthPlan B, HealthPlan C',
        appointmentWaitTimes: '1 day',
        reachable: 'Yes',
        positiveFeedback: '92%',
        nursingHomeQuality: '5 stars'
    },
    {
        id: 'provider_6',
        negotiatedPrice: '$240',
        completesNetwork: 'Yes',
        participatingNetworks: 'HealthPlan C',
        appointmentWaitTimes: '6 days',
        reachable: 'No',
        positiveFeedback: '80%',
        nursingHomeQuality: '4 stars'
    },
    {
        id: 'provider_7',
        negotiatedPrice: '$190',
        completesNetwork: 'No',
        participatingNetworks: 'HealthPlan A, HealthPlan B',
        appointmentWaitTimes: '2 days',
        reachable: 'Yes',
        positiveFeedback: '87%',
        nursingHomeQuality: '3 stars'
    }
];

// Function to add squares representing providers
function addSquares() {
    const container = document.getElementById('container');
    const numberOfSquares = providers.length;
    const containerRect = container.getBoundingClientRect();

    for (let i = 0; i < numberOfSquares; i++) {
        const provider = providers[i];
        const square = document.createElement('div');
        square.className = 'square';
        square.style.width = '20px';
        square.style.height = '20px';
        square.style.border = '1px solid black';
        square.style.position = 'fixed';
        square.style.zIndex = '1000';
        square.style.cursor = 'pointer';
        // Position the squares
        const centerTop = containerRect.top + containerRect.height / 2;
        const centerLeft = containerRect.left + containerRect.width / 2;
        const randomTop = centerTop + (Math.random() - 0.5) * 400;
        const randomLeft = centerLeft + (Math.random() - 0.5) * 400;

        square.style.top = `${randomTop}px`;
        square.style.left = `${randomLeft}px`;

        // Assign an ID to each square
        square.id = provider.id;

        // Store provider index for easy access
        square.dataset.providerIndex = i;

        // Add click event listener to open the modal
        square.addEventListener('click', openProviderPopup);

        document.body.appendChild(square);
    }
}

// Function to open the modal and display provider information
function openProviderPopup(e) {
    selectedSquare = e.target;
    const providerIndex = selectedSquare.dataset.providerIndex;
    const provider = providers[providerIndex];

    // Update the modal content with provider information
    const modalBody = document.querySelector('#providerModal .modal-body');
    modalBody.innerHTML = `
        <p><strong>Negotiated Price:</strong> ${provider.negotiatedPrice}</p>
        <p><strong>Completes Network:</strong> ${provider.completesNetwork}</p>
        <p><strong>Participating Networks:</strong> ${provider.participatingNetworks}</p>
        <p><strong>Appointment Wait Times:</strong> ${provider.appointmentWaitTimes}</p>
        <p><strong>Reachable:</strong> ${provider.reachable}</p>
        <p><strong>Positive Feedback:</strong> ${provider.positiveFeedback}</p>
        <p><strong>Nursing Home Quality:</strong> ${provider.nursingHomeQuality}</p>
    `;

    // Show the provider modal
    const providerModal = new bootstrap.Modal(document.getElementById('providerModal'));
    providerModal.show();
}

// Event listener for the "Compare provider" button
document.getElementById('compareProviderButton').addEventListener('click', function() {
    if (selectedSquare) {
        // Add the provider to the comparison array if not already added
        const providerIndex = selectedSquare.dataset.providerIndex;
        const provider = providers[providerIndex];
        if (!comparisonProviders.includes(provider)) {
            comparisonProviders.push(provider);
        }
    }

    // Close the provider modal
    const providerModal = bootstrap.Modal.getInstance(document.getElementById('providerModal'));
    providerModal.hide();

    // If at least two providers are selected, show the comparison modal
    if (comparisonProviders.length >= 2) {
        // Update the comparison modal content
        const comparisonModalBody = document.querySelector('#comparisonModal .modal-body');
        let comparisonContent = '<table class="table"><thead><tr><th>Provider NPI</th>';

        // Add provider IDs to the table header
        comparisonProviders.forEach(provider => {
            comparisonContent += `<th>${provider.id}</th>`;
        });
        comparisonContent += '</tr></thead><tbody>';

        // List of fields to compare
        const fields = [
            'negotiatedPrice',
            'completesNetwork',
            'participatingNetworks',
            'appointmentWaitTimes',
            'reachable',
            'positiveFeedback',
            'nursingHomeQuality'
        ];

        // Add rows for each field
        fields.forEach(field => {
            comparisonContent += `<tr><td><strong>${field.replace(/([A-Z])/g, ' $1')}</strong></td>`;
            comparisonProviders.forEach(provider => {
                comparisonContent += `<td>${provider[field]}</td>`;
            });
            comparisonContent += '</tr>';
        });

        comparisonContent += '</tbody></table>';
        comparisonModalBody.innerHTML = comparisonContent;

        // Show the comparison modal
        const comparisonModal = new bootstrap.Modal(document.getElementById('comparisonModal'));
        comparisonModal.show();
    } else {
        alert('Please select at least two providers to compare.');
    }
});

// Event listener for the "Add provider" button
document.getElementById('addProviderButton').addEventListener('click', function() {
    if (selectedSquare) {
        // Change the square color to green
        selectedSquare.style.backgroundColor = 'green';
    }
    providerCost += 0.2;
    document.getElementById("provider-cost").innerHTML = "$" + providerCost + "M";
    // Close the provider modal
    const providerModal = bootstrap.Modal.getInstance(document.getElementById('providerModal'));
    providerModal.hide();
});
