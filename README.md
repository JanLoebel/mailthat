# MailThat

MailThat is a kind of proxy/service to forward mails from HTTP-Requests or received via SMTP.

<a href="https://www.buymeacoffee.com/JanLoebel" rel="Buy me a coffee!">![Foo](https://cdn.buymeacoffee.com/buttons/default-orange.png)</a>

## WORK IN PROGRESS - HELP IS WELCOME\*\*

- Test real email server (outgoing smtp options)
- Add example key / cert file for secure serving
- Add smtp tests
- Add more documentation how to configure and run
- Add form based submit
- Add more predefined authentication strategies for HTTP
- [https://www.npmjs.com/package/tslog](https://www.npmjs.com/package/tslog) -> Add request id for http logging

## Basic idea

Providing a small service to fullfil two services regarding sending emails.

### HTTP

If you just want a HTTP-API to send emails with overwritable properties you can just use MailThat to provide these API.

### SMTP

While using different services (Wordpress, others..) you always have to configure a mail services. But what if you use e.g.: a private GMAIL account. And you don't want to enter you're password in different services? With MailThat you can just create a new user and enter these credentials to the services and just use the _real_ credentials in MailThat itself. So MailThat will work as a _MailRelay_.

## How to start

Basically there are two ways, use the source code or simply use docker to start the service.

### Source Code

- Start by cloning the repository: `git clone https://github.com/JanLoebel/mailthat.git`
- Change into the cloned directory: `cd mailthat`
- Run `npm install` to install all needed dependencies
- If you just want to start mailthat run: `npm start`
- If you want to start mailthat and watch for changes run: `npm run start:dev`

### Docker

The docker image is published to the docker hub registry. Therefore it's pretty simple to use docker to get started. In the directory `docker-example` you can find an example config and `docker-compose` file. The `docker-compose` file just start the docker image with the config directory as a mounted volume to provide the example config to the service. If you don't want to use `docker-compose` you can also change to the `docker-example` directory and execute `docker run -it --rm -v $(pwd)/config:/config mailthat`.

## Configuration options

The configuration is a json file which will be validated on startup. For an example file checkout `config/config.json` or `docker-example/config/config.json`. They are more easy readable then the available options here ;)

| Option         | Description                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| `outgoingSmtp` | _Required_ Server configuration, see `OutgoingSmtp configuration options`.<br><br>**Type:** `object`<br> |
| `httpServices` | _Optional_ Array of HttpServices, see `HttpServices configuration options`.<br><br>**Type:** `array`<br> |
| `smtpServices` | _Optional_ Array of SmtpServices, see `SmtpServices configuration options`.<br><br>**Type:** `array`<br> |

### OutgoingSmtp configuration options

| Option      | Description                                                                   |
| ----------- | ----------------------------------------------------------------------------- |
| `host`      | _Required_ Server port to listen.<br><br>**Type:** `string`<br>               |
| `port`      | _Required_ Server port to listen.<br><br>**Type:** `number`<br>Default: 3000  |
| `ignoreTLS` | _Optional_ Server port to listen.<br><br>**Type:** `boolean`<br>Default: 3000 |
| `secure`    | _Optional_ Server port to listen.<br><br>**Type:** `boolean`<br>Default: 3000 |

### HttpServices configuration options

| Option     | Description                                                                                         |
| ---------- | --------------------------------------------------------------------------------------------------- |
| `port`     | _Required_ HTTP-Server port to listen.<br><br>**Type:** `number`<br>                                |
| `auth`     | _Optional_ Authentication options, see `HTTP Authentication options`.<br><br>**Type:** `object`<br> |
| `defaults` | _Optional_ Default values, see `Defaults configuration options`.<br><br>**Type:** `object`<br>      |

### Http Authentication configuration options

| Option     | Description                                                                                   |
| ---------- | --------------------------------------------------------------------------------------------- |
| `type`     | _Required_ Which type should be used. Options: `basic`<br><br>**Type:** `string`<br>          |
| `username` | _Required if type === basic_ Username for basic authentication.<br><br>**Type:** `string`<br> |
| `password` | _Required if type === basic_ Password for basic authentication.<br><br>**Type:** `string`<br> |

### SmtpServices configuration options

| Option        | Description                                                                                                                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `port`        | _Required_ SMTP-Server port to listen.<br><br>**Type:** `number`<br>                                                                                                                                  |
| `auth`        | _Optional_ Authentication options, see `SMTP Authentication options`.<br><br>**Type:** `object`<br>                                                                                                   |
| `defaults`    | _Optional_ Default values, see `Defaults configuration options`.<br><br>**Type:** `object`<br>                                                                                                        |
| `allowedIps`  | _Optional_ The ip values of clients that are allowed to connect, e.g: `127.0.0.1` then only the local host can connect to the smtp server.<br><br>**Type:** `array<string>`<br>                       |
| `secure`      | _Optional_ Should the smtp services served secure, if you want to enable it you will have to provide the file path to the `key` and `cert`-files as an object.<br><br>**Type:** `false \| object`<br> |
| `secure.cert` | _Required if secure_ File path to the `cert`-file.<br><br>**Type:** `string`<br>                                                                                                                      |
| `secure.key`  | _Required if secure_ File path to the `key`-file.<br><br>**Type:** `string`<br>                                                                                                                       |

### Smtp Authentication configuration options

| Option     | Description                                                                                   |
| ---------- | --------------------------------------------------------------------------------------------- |
| `type`     | _Required_ Which type should be used. Options: `basic`<br><br>**Type:** `string`<br>          |
| `username` | _Required if type === basic_ Username for basic authentication.<br><br>**Type:** `string`<br> |
| `password` | _Required if type === basic_ Password for basic authentication.<br><br>**Type:** `string`<br> |

### Defaults configuration options

| Option    | Description                                                                                                                  |
| --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `to`      | _Optional_ Define email recipient (overwrites the value received if defined).<br><br>**Type:** `string \| array<string>`<br> |
| `from`    | _Optional_ Define email sender (overwrites the value received if defined).<br><br>**Type:** `string`<br>                     |
| `subject` | _Optional_ Define email subject (overwrites the value received if defined).<br><br>**Type:** `string`<br>                    |
| `text`    | _Optional_ Define email text/body (overwrites the value received if defined).<br><br>**Type:** `string`<br>                  |

## Contribution

Please feel free to improve or modify the code and open a Pull-Request! Any contribution is welcome :)

## License

MIT License

Copyright (c) 2021 Jan Löbel

See LICENSE file for details.

## Alternative projects

- [mailit](https://github.com/Rahul-Bisht/mailit)
-
