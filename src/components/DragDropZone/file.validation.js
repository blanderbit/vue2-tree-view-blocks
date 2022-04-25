export class FileValidation {
  /**
   *
   * @param files <Array<File>>
   * @param options <[Array.<string>,Array.<{
   *  type: string,
   *  invalidText: string
   * }>]>
   */

  static options = {
    shp: { extension: '.shp' },
    kml: { extension: '.kml' },
    kmz: { extension: '.kmz' },
    zip: { extension: '.zip' }
  }

  /**
   *
   * @param files
   * @param options
   * @return {{
   *  successFiles: Array,
   *  errorFiles: Array
   * }}
   */

  static checkFileForFileExtension(files, options) {
    const result = {
      successFiles: [],
      errorFiles: []
    }

    if (!options.length) {
      return {
        ...result,
        successFiles: files
      }
    }

    files.forEach((item) => {
      const filterOptionResult = options.find((option) => {
        return item?.name?.includes(option.extension)
      })

      filterOptionResult
        ? result.successFiles.push(item)
        : result.errorFiles.push(item)
    })

    return result
  }
}
