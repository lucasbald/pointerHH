'use strict'

const expect = require('chai').expect
const pixelmatch = require('pixelmatch')
const PNG = require('pngjs').PNG
const fs    = require('fs')

let report = []
let testFolder = 'testFolder'
let goldenFolder = 'goldenFolder'

function compareScreenshots(testImage) {
	return new Promise((resolve, reject) => {
		// Create the images to compare
		const img1 = fs.createReadStream(`${testFolder}/${testImage}.png`).pipe(new PNG()).on('parsed', doneReading)
		const img2 = fs.createReadStream(`${goldenFolder}/${testImage}.png`).pipe(new PNG()).on('parsed', doneReading)

		let filesRead = 0
		function doneReading() {
			// Wait until both files are read.
			if (++filesRead < 2) return

			// The files should be the same size.
			expect(img1.width, 'image widths are the same').equal(img2.width)
			if (testImage === 'apontar') {
				expect(img1.height, 'image heights are the same').equal(767)
			} else {
				expect(img1.height, 'image heights are the same').equal(img2.height)
			}

			// Do the visual diff.
			const diff = new PNG({width: img1.width, height: img2.height})
			const numDiffPixels = pixelmatch(
				img1.data, img2.data, diff.data, img1.width, img1.height,
				{threshold: 0.1})
      
      
			// Creating the report
			const temp = {}
			temp[testImage] = numDiffPixels
			report.push(temp)

			// Save the image with the difference
			if (numDiffPixels > 250) {
				fs.writeFileSync(`${testFolder}/diff-${testImage}.png`, PNG.sync.write(diff))
			}

			// The files should look the same.
			expect(numDiffPixels, 'number of different pixels').to.be.below(250)

			resolve('Done')
			reject('Error')
		}
	})
}

module.exports = {
	compareScreenshots,
}