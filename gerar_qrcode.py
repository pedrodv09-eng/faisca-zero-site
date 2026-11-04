"""Gera um QR code em PNG apontando para a URL pública do site.
Uso: python gerar_qrcode.py https://seu-usuario.github.io/faisca-zero-site/
"""
import sys
import qrcode

if len(sys.argv) < 2:
    print("Uso: python gerar_qrcode.py <url-do-site>")
    sys.exit(1)

url = sys.argv[1]
img = qrcode.make(url, box_size=12, border=2)
img.save("qrcode-faisca-zero.png")
print("QR code salvo em qrcode-faisca-zero.png, apontando para:", url)
