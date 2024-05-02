export default {
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "test-reports", // Specify the directory where XML files will be generated
        outputName: "jest-junit.xml", // Specify the name of the XML file
      },
    ],
  ],
};
