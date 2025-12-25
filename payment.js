// --- CONFIG: REPLACE THESE WITH YOUR REAL LINKS / IBANS ---
    const PAYPAL_ME_LINK = 'https://www.paypal.me/vskaPay';
    const PAYONEER_LINK = 'https://payoneer.com/invoice/YOUR_INVOICE_LINK'; // replace with real invoice link
    const TBC_IBAN = 'GE10TB7025045061100132';
    const TBC_NAME = 'NIKOLOZ GRIGOLIA';
    const BOG_IBAN = 'GE43BG0000000022320900';
    const BOG_NAME = 'ნიკოლოზ გრიგოლია';
    // --------------------------------------------------------

    const methodsEls = document.querySelectorAll('.method');
    const methodSpecific = document.getElementById('method-specific');
    const payBtn = document.getElementById('pay-button');
    const status = document.getElementById('status');
    const amount = document.getElementById('display-amount').textContent.trim().split(' ')[0];;
    // document.getElementById('display-amount').textContent.trim().split(' ')[0];
    let selected = 'paypal';
    function setActive(el){
      methodsEls.forEach(m=>m.classList.remove('active'));
      el.classList.add('active');
      selected = el.dataset.method;
      renderMethodSpecific(selected);
    }
    methodsEls.forEach(m=>m.addEventListener('click', ()=>setActive(m)));

    function renderMethodSpecific(m){
      methodSpecific.innerHTML = '';
      status.textContent = '';
      if(m === 'paypal'){
        document.getElementById('pay-button').style.display = 'block';
        methodSpecific.innerHTML = `<div style="margin-top:10px;color:var(--muted);font-size:13px">Click on <b>PAY</b> to continue on paypal and join our tournament</div>`;
        document.getElementById('display-amount').innerHTML = '10 $';
      } else if(m === 'tbc'){
        document.getElementById('display-amount').innerHTML = '10 ₾';
        document.getElementById('pay-button').style.display = 'none';
        methodSpecific.innerHTML = `<div class="bank-card"><div style="font-weight:700">TBC (Bank transfer)</div><div style="margin-top:6px;color:var(--muted);font-size:13px">Account holder: <strong id=\"tbc-name\">${TBC_NAME}</strong></div><div style="margin-top:6px">IBAN: <strong id=\"tbc-iban\">${TBC_IBAN}</strong></div><div style="margin-top:8px;color:var(--muted);font-size:13px">გადახდის აღწერაში მიუთითეთ "Order #000123"</div></div>`;
      } else if(m === 'bog'){
        document.getElementById('display-amount').innerHTML = '10 ₾';
        document.getElementById('pay-button').style.display = 'none';
        methodSpecific.innerHTML = `<div class="bank-card"><div style="font-weight:700">Bank of Georgia (Bank transfer)</div><div style="margin-top:6px;color:var(--muted);font-size:13px">Account holder: <strong id=\"bog-name\">${BOG_NAME}</strong></div><div style="margin-top:6px">IBAN: <strong id=\"bog-iban\">${BOG_IBAN}</strong></div><div style="margin-top:8px;color:var(--muted);font-size:13px">გადახდის აღწერაში მიუთითეთ "Order #000123"</div></div>`;
      }
    }

    // initial render
    renderMethodSpecific(selected);

    payBtn.addEventListener('click', ()=>{
      status.textContent = '';
      const email = document.getElementById('email').value;

      if(selected === 'paypal'){
        // Use PayPal.Me format: https://www.paypal.me/username/AMOUNT
        // If user provided full link with trailing slash, ensure concatenation safe
        let base = PAYPAL_ME_LINK.replace(/\/+$/,'');
        if(!base){ status.textContent = 'PAYPAL_ME_LINK error'; return;}
        const url = `${base}/${amount}`;
        window.open(url, '_blank');
        status.textContent = 'Continue to paypal';
        // Optionally, you can log order to your server here (not included)
        return;
      }

      // if(selected === 'payoneer'){
      //   if(!PAYONEER_LINK || PAYONEER_LINK.includes('YOUR_INVOICE')){ status.textContent = 'ჩაანაცვლეთ PAYONEER_LINK რეალური ინვოის ბმულით.'; return; }
      //   window.open(PAYONEER_LINK, '_blank');
      //   status.textContent = 'Continue on Payoneer...';
      //   return;
      // }
    });