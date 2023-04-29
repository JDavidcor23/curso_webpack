const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  //Punto de entrada
  entry: "./src/index.js",
  //Punto de salida
  output: {
    path: path.resolve(__dirname, "dist"), // __dirname is the current directory
    filename: "[name].[contenthash].js", // name es el nombre del archivo de entrada y contenthash es un hash que se genera automaticamente para identificar la version del archivo
    assetModuleFilename: "assets/images/[hash][ext][query]", // esto nos permite mover los archivos de la carpeta src/assets/images a dist/assets/images
  },
  // extensiones que vamos a utilizar
  resolve: {
    extensions: [".js"], //Extensiones que vamos a utilizar
    alias: {
      // esto nos permite crear alias para las rutas
      "@utils": path.resolve(__dirname, "src/utils/"),
      "@templates": path.resolve(__dirname, "src/templates/"),
      "@styles": path.resolve(__dirname, "src/styles/"),
      "@images": path.resolve(__dirname, "src/assets/images/"),
    },
  },
  // el module es un objeto con las reglas necesarias que vamos a utilizar
  module: {
    rules: [
      {
        test: /\m?.js$/, // esta expresion regular nos permite identificar los archivos que vamos a utilizar
        exclude: /node_modules/, //excluimos la carpeta de node_modules
        use: {
          loader: "babel-loader", // utilizamos el loader de babel
        },
      },
      {
        test: /\.css|.styl$/i /* si solo quieres css /\.css|$/i */,
        use: [MiniCssExtractPlugin.loader, "css-loader", "stylus-loader"],
      },
      // esto nos ayuda a poder importar imagenes en el js como si fuera un modulo
      {
        test: /\.png/,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2)$/, // esta expresion regular nos permite identificar los archivos que vamos a utilizar especificamente las fuentes
        use: {
          loader: "url-loader", // utilizamos el loader de url
          options: {
            limit: 10000, // si la fuente es menor a 10kb la convierte a base64
            mimetype: "application/font-woff", // especificamos el tipo de dato
            name: "[name].[contenthash].[ext]", // nombre de salida y el hash es para identificar la version del archivo
            outputPath: "./assets/fonts/", // ruta de salida
            publicPath: "../assets/fonts/", // ruta publica
            esModule: false, // esto es para que no nos de un error al momento de importar la fuente
          },
        },
      },
    ],
  },
  // los plugins son un arreglo de elementos que nos permite extender las funcionalidades de webpack
  plugins: [
    new HtmlWebpackPlugin({
      inject: true, // inyecta el bundle al template html
      template: "./public/index.html", // la ubicacion del template
      filename: "./index.html", // nombre final del archivo
    }),
    new MiniCssExtractPlugin({
      filename: "assets/[name].[contenthash].css", // nombre de salida del archivo
    }),
    // esta configuracion nos permite mover los archivos de la carpeta src/assets/images a dist/assets/images
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "assets/images"), // carpeta a mover
          to: "assets/images", // carpeta de destino
        },
      ],
    }),
    new Dotenv(), // esto nos permite trabajar con variables de entorno
    new CleanWebpackPlugin(), // esto nos permite limpiar la carpeta dist
  ],
  // esto nos permite optimizar el proyecto
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(), // para el css
      new TerserPlugin(), // para el js
    ],
  },
};

// instalaciones
//npm install webpack webpack-cli -D
//npm install -D babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime
//npm i html-webpack-plugin -D
// npm i mini-css-extract-plugin css-loader -D
// si quieres trabajar con preprocesadores de css por ejemplo stylus ( npm i stylus-loader -D )
// npm i copy-webpack-plugin -D
// npm install url-loader file-loader -D esto nos permite importar loaders en archivos css por ejemplo si queremos importar una fuente
// obtimizar el proyecto npm i -D css-minimizer-webpack-plugin terser-webpack-plugin
// trabajar con variables de entorno npm install -D dotenv-webpack
// npm install clean-webpack-plugin -D  esto sirve para limpiar la carpeta dist
