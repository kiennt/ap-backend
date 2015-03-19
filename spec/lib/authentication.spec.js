import Authentication from '../../dist/lib/authentication';
import HttpHeaders from '../../dist/config/http-headers';

describe('generateSignature', () => {
  it('should return true when generating signature', (done) => {
    let data = {
      'password': 'k',
      'timestamp': '1395914520',
      'username_or_email': 'trungkien2288@gmail.com'
    };
    let url = 'https://api.pinterest.com/v3/login/';
    let signature = Authentication.generateSignature('POST', url, data);
    expect(signature).toBe('6ee35c775b5f92668530d9cc2b91d9380c4bf01f1b17ccfa73ecfd2867b7b562');
    done();
  });
});
