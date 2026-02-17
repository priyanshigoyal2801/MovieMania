import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class Login {

    public static void main(String[] args) throws InterruptedException {

        WebDriver driver = new ChromeDriver();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        driver.get("https://moviemania.pratham.codes/login");
        driver.manage().window().maximize();
        Thread.sleep(2000);

        WebElement email = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.name("email"))
        );
        email.sendKeys("testing2@gmail.com");
        Thread.sleep(1500);

        WebElement password = driver.findElement(By.name("password"));
        password.sendKeys("TestPass2@");
        Thread.sleep(1500);

        WebElement loginBtn = driver.findElement(
                By.xpath("//button[@type='submit']")
        );
        Thread.sleep(1000); 
        loginBtn.click();

        wait.until(ExpectedConditions.urlContains("/dashboard"));
        Thread.sleep(6000);
        System.out.println("User Login Successful");
        driver.quit();
    }
}
