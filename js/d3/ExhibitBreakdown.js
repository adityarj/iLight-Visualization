/**
 * Created by HP-PC on 24-04-2017.
 */

var processedData = {
};

d3.csv("data/photoData.csv",function (error, data) {
    data.forEach(function (d, i) {
        if (!processedData[d.exhibition]) {
            processedData[d.exhibition] = {

            };
            processedData[d.exhibition][d.Time] = 1;
        } else {
            if (!processedData[d.exhibition][d.Time]) {
                processedData[d.exhibition][d.Time] = 1;
            } else {
                processedData[d.exhibition][d.Time]+=1;
            }

        }
    });

    console.log(processedData);
});